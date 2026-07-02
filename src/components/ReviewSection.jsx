import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck, Camera, ImagePlus, Send, Star, UserRound, X } from 'lucide-react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const BUCKET_NAME = 'review-photos'
const UPLOAD_TIMEOUT_MS = 30000
const createUploadId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
const withTimeout = (promise, ms) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error(`Photo upload timed out after ${Math.round(ms / 1000)} seconds.`)), ms))
])
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024

async function compressReviewPhoto(file) {
  if (file.size <= MAX_UPLOAD_BYTES) return file
  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('This image could not be decoded for compression.'))
      img.src = objectUrl
    })
    const maxDimension = 1920
    const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
    const context = canvas.getContext('2d')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    let blob = null
    for (const quality of [.86, .76, .66, .56, .46]) {
      blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality))
      if (blob && blob.size <= MAX_UPLOAD_BYTES) break
    }
    if (!blob) throw new Error('Image compression failed.')
    if (blob.size > MAX_UPLOAD_BYTES) throw new Error('The compressed image is still larger than 2 MB.')
    return new File([blob], `${file.name.replace(/\.[^.]+$/, '') || 'review-photo'}.jpg`, { type: 'image/jpeg', lastModified: Date.now() })
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
const initials = name => name.trim().split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase() || '?'

export default function ReviewSection({ t, lang }) {
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState({ name: '', text: '' })
  const [rating, setRating] = useState(5)
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState('')
  const [processingPhoto, setProcessingPhoto] = useState(false)
  const [notice, setNotice] = useState('')
  const [sending, setSending] = useState(false)
  const inputRef = useRef()

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!isSupabaseConfigured) {
        setReviews(t.seeded.map(([name, text], i) => ({ id: i, name, text, created_at: new Date(Date.now() - i * 86400000).toISOString() })))
        return
      }
      let result = await supabase.from('reviews').select('id,name,review,photo_url,rating,created_at').eq('approved', true).order('created_at', { ascending: false })
      if (result.error?.code === '42703') result = await supabase.from('reviews').select('id,name,review,photo_url,created_at').eq('approved', true).order('created_at', { ascending: false })
      const { data, error } = result
      if (!active) return
      if (error) setNotice(t.loadError)
      else setReviews((data || []).map(r => ({ ...r, text: r.review })))
    })()
    return () => { active = false }
  }, [t])

  async function choose(event) {
    const selectedFile = event.target.files?.[0] ?? null
    let file = selectedFile
    console.log('[Review photo] selected file:', file)
    console.log('[Review photo] file name:', file?.name)
    console.log('[Review photo] file size:', file?.size)
    console.log('[Review photo] bucket name:', BUCKET_NAME)

    if (!file) {
      clearPhoto()
      return
    }

    const extension = file.name.split('.').pop()?.toLowerCase()
    const supportedType = file.type.startsWith('image/') || ['heic','heif'].includes(extension)
    if (!supportedType || file.size > 25 * 1024 * 1024) {
      clearPhoto()
      setNotice(t.photoError)
      return
    }

    try {
      setProcessingPhoto(true)
      setNotice(file.size > MAX_UPLOAD_BYTES ? 'Fotoğraf 2 MB altına küçültülüyor…' : '')
      file = await compressReviewPhoto(file)
      console.log('[Review photo] compressed file:', file)
      console.log('[Review photo] compressed size:', file.size)
      setPhoto(file)
      setPreview(URL.createObjectURL(file))
      setNotice('')
    } catch (compressionError) {
      console.error('[Review photo] compression error:', compressionError)
      clearPhoto()
      setNotice(`Fotoğraf küçültülemedi. ${compressionError?.message || ''}`.trim())
    } finally {
      setProcessingPhoto(false)
    }
  }

  function clearPhoto() {
    setPhoto(null)
    setPreview('')
    setProcessingPhoto(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function submit(event) {
    event.preventDefault()
    const name = form.name.trim()
    const review = form.text.trim()
    if (processingPhoto) {
      setNotice('Fotoğraf işlenirken lütfen bekle.')
      return
    }
    if (!name || !review) {
      setNotice(t.empty)
      return
    }

    setSending(true)
    setNotice('')

    if (!isSupabaseConfigured) {
      setReviews(current => [{ id: Date.now(), name, text: review, photo_url: preview || null, created_at: new Date().toISOString() }, ...current])
      setForm({ name: '', text: '' })
      clearPhoto()
      setSending(false)
      setNotice(t.thanks)
      return
    }

    let photo_url = null
    if (photo) {
      const safeName = photo.name.replace(/[^a-zA-Z0-9._-]/g, '-')
      const uploadPath = `${Date.now()}-${createUploadId()}-${safeName}`
      console.log('[Review photo] selected file before upload:', photo)
      console.log('[Review photo] file name before upload:', photo.name)
      console.log('[Review photo] file size before upload:', photo.size)
      console.log('[Review photo] bucket name before upload:', BUCKET_NAME)
      console.log('[Review photo] upload path:', uploadPath)
      console.log('FILE TYPE:', photo.type)
      console.log('FILE SIZE:', photo.size)
      console.log('FILE NAME:', photo.name)
      console.log('UPLOAD PATH:', uploadPath)
      console.log('BUCKET NAME:', BUCKET_NAME)

      try {
        const { data: uploadData, error: uploadError } = await withTimeout(
          supabase.storage
            .from(BUCKET_NAME)
            .upload(uploadPath, photo, { cacheControl: '3600', contentType: photo.type || 'application/octet-stream', upsert: false }),
          UPLOAD_TIMEOUT_MS
        )

        console.error('UPLOAD DATA:', uploadData)
        console.error('UPLOAD ERROR:', uploadError)
        console.error('UPLOAD ERROR JSON:', JSON.stringify(uploadError, null, 2))

        if (uploadError) {
          console.error('[Review photo] complete upload error:', uploadError)
          setNotice(`${t.uploadError} ${uploadError.message || ''}`.trim())
          setSending(false)
          return
        }

        console.log('[Review photo] upload result:', uploadData)
        const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(uploadPath)
        photo_url = publicUrlData?.publicUrl || null
        if (!photo_url) {
          const publicUrlError = new Error('Public image URL could not be created.')
          console.error('[Review photo] complete public URL error:', publicUrlError)
          setNotice(`${t.uploadError} ${publicUrlError.message}`)
          setSending(false)
          return
        }
      } catch (uploadException) {
        console.error('[Review photo] complete upload exception:', uploadException)
        setNotice(`${t.uploadError} ${uploadException?.message || ''}`.trim())
        setSending(false)
        return
      }
    }

    try {
      let insertResult = await withTimeout(
        supabase.from('reviews').insert({ name, review, photo_url, rating, approved: false }),
        15000
      )
      if (insertResult.error?.code === '42703') insertResult = await withTimeout(supabase.from('reviews').insert({ name, review, photo_url, approved: false }), 15000)
      const { error: insertError } = insertResult
      if (insertError) {
        console.error('[Review] insert error:', insertError)
        setNotice(`${t.sendError} (${insertError.message})`)
        return
      }
      setForm({ name: '', text: '' })
      setRating(5)
      clearPhoto()
      setNotice(t.pending)
    } catch (insertException) {
      console.error('[Review] insert exception:', insertException)
      setNotice(`${t.sendError} (${insertException?.message || 'Request timed out'})`)
    } finally {
      setSending(false)
    }
  }

  const ratedReviews=reviews.filter(r=>Number.isFinite(Number(r.rating)))
  const average=ratedReviews.length?(ratedReviews.reduce((sum,r)=>sum+Number(r.rating),0)/ratedReviews.length).toFixed(2):'5.00'
  return <section id="reviews" className="section shell reviews-section">
    <div className="section-kicker">06 / SURVIVOR ARCHIVE</div>
    <div className="review-heading">
      <div><h2>{t.reviewTitle}</h2><p className="section-sub">{t.reviewSub}</p></div>
      <div className="rating"><strong>{average}</strong><span>{[1,2,3,4,5].map(x=><Star key={x} size={14} fill="currentColor"/>)}<small>{t.communityRating} · {ratedReviews.length||58} rescues</small></span></div>
    </div>
    <div className="review-grid">
      <form className="review-form glass" onSubmit={submit}>
        <div className="form-title"><Camera/><div><strong>{t.shareStory}</strong><small>{t.moderated}</small></div></div>
        <div className="photo-field">
          <label className={`photo-preview ${photo?'has-photo':''}`}>{preview?<img src={preview} alt="Selected review preview"/>:<><ImagePlus/><span>{t.addPhoto}</span></>}<input ref={inputRef} className="photo-input-native" type="file" accept="image/*" onClick={e=>{e.currentTarget.value=''}} onChange={choose}/></label>
          {preview&&<button type="button" className="remove-photo" onClick={clearPhoto} aria-label="Remove photo"><X size={14}/></button>}
          <small className={photo?'photo-selected-label':''}>{processingPhoto?'Fotoğraf 2 MB altına küçültülüyor…':photo?({tr:'✓ Fotoğraf hazır · 2 MB altında',de:'✓ Foto bereit · unter 2 MB',en:'✓ Photo ready · under 2 MB'}[lang]||'✓ Photo ready · under 2 MB'):t.photoHint}</small>
        </div>
        <label>{t.name}<div><UserRound size={17}/><input value={form.name} maxLength="40" disabled={sending} onChange={e=>setForm({...form,name:e.target.value})} placeholder={t.namePlaceholder}/></div></label>
        <label>{t.review}<textarea value={form.text} maxLength="240" disabled={sending} onChange={e=>setForm({...form,text:e.target.value})} placeholder={t.reviewPlaceholder}/><span className="counter">{form.text.length}/240</span></label>
        <fieldset className="star-picker"><legend>Your rescue rating</legend><div>{[1,2,3,4,5].map(value=><button type="button" key={value} onClick={()=>setRating(value)} aria-label={`${value} stars`} className={value<=rating?'selected':''}><Star fill={value<=rating?'currentColor':'none'}/></button>)}</div><strong>{rating} / 5</strong></fieldset>
        <button className="btn primary" disabled={sending||processingPhoto}><Send size={16}/>{sending?t.loading:t.submit}</button>
        {notice&&<p className="notice" role="alert">{notice}</p>}
      </form>
      <div className="review-list">{reviews.map((r,i)=><motion.article className="review-card glass" key={r.id??r.name+i} whileHover={{y:-5}}><div className="review-top"><div className="avatar"><span>{initials(r.name)}</span></div><div className="review-person"><strong>{r.name}</strong><span><BadgeCheck size={14}/>{t.verified}</span></div><time>{new Intl.DateTimeFormat(lang,{month:'short',year:'numeric'}).format(new Date(r.created_at))}</time></div><div className="mini-stars">{'★'.repeat(r.rating||5)}{'☆'.repeat(5-(r.rating||5))}</div><p>“{r.text}”</p>{r.photo_url&&<img className="review-attachment" src={r.photo_url} alt="Review attachment" loading="lazy"/>}</motion.article>)}</div>
    </div>
  </section>
}
