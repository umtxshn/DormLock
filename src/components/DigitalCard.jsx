import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Instagram, KeyRound } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { featureTranslations } from '../data/featureTranslations'
import { copyInstagramMessage, instagramContactCopy, INSTAGRAM_URL } from '../lib/instagramContact'

export default function DigitalCard({ lang }) {
  const c = featureTranslations[lang] || featureTranslations.en
  const contact = instagramContactCopy[lang] || instagramContactCopy.en
  const url = typeof window === 'undefined' ? 'https://dormlock.app' : window.location.origin
  const [toast, setToast] = useState('')

  async function openInstagram() {
    const copyPromise = copyInstagramMessage(lang)
    window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer')
    const copied = await copyPromise
    setToast(copied ? contact.success : contact.fallback)
    window.setTimeout(() => setToast(''), 3000)
  }

  return <>
    <section className="section shell digital-section" id="contact">
      <div className="section-kicker">{c.digitalKicker}</div>
      <div className="digital-card glass">
        <div className="digital-brand"><span><KeyRound/></span>DormLock</div>
        <div className="digital-copy"><small>{c.founder}</small><h2>Umut</h2><p>{c.status}</p>
          <div className="digital-actions"><button type="button" onClick={openInstagram}><Instagram/>{contact.label}</button></div>
        </div>
        <div className="qr-wrap"><QRCodeSVG value={url} size={132} bgColor="transparent" fgColor="#11131c" level="M"/><small>{c.scan}</small></div>
      </div>
    </section>
    <AnimatePresence>{toast && <motion.div className="instagram-toast" role="status" initial={{opacity:0,x:'-50%',y:18,scale:.96}} animate={{opacity:1,x:'-50%',y:0,scale:1}} exit={{opacity:0,x:'-50%',y:12,scale:.97}}>{toast}</motion.div>}</AnimatePresence>
  </>
}
