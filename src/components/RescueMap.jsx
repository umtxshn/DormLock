import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { featureTranslations } from '../data/featureTranslations'

const residences = [
  { name: 'Emil-Figge-Straße 3, 7, 9', coords: [51.4916635, 7.43084], image: '/images/emil-figge.webp', rescued: true },
  { name: 'Ostenbergstraße 109', coords: [51.4887849, 7.4228608], image: '/images/ostenberg.webp', rescued: true },
  { name: 'Meitnerweg 3–16', coords: [51.4883499, 7.4104507], image: '/images/meitnerweg.webp', rescued: true },
  { name: 'Baroper Straße 331, 335', coords: [51.4822975, 7.4103504], image: '/images/baroper.webp', rescued: true },
  { name: 'Am Gardenkamp 43–45', coords: [51.48165, 7.41575], image: '/images/gardenkamp-43-45.webp', rescued: false },
  { name: 'Am Gardenkamp 53–55', coords: [51.48095, 7.41465], image: '/images/gardenkamp-53-55.webp', rescued: false },
  { name: 'Vogelpothsweg 82–122', coords: [51.4937, 7.4174], image: '/images/vogelpothsweg.webp', rescued: false },
]

const waitingCopy = {
  tr: { label: 'HENÜZ ÇAĞRI GELMEDİ', story: 'Şimdilik kimse burada mahsur kalmadı.' },
  de: { label: 'NOCH KEIN EINSATZ', story: 'Bisher wurde hier noch niemand gerettet.' },
  en: { label: 'NO RESCUE CALL YET', story: 'No one has been rescued here yet.' },
}

export default function RescueMap({ lang }) {
  const c = featureTranslations[lang] || featureTranslations.en
  const pending = waitingCopy[lang] || waitingCopy.en
  const mapNode = useRef(null)
  const mapInstance = useRef(null)
  const [selected, setSelected] = useState(residences[0])
  const rescued = residences.filter((place) => place.rescued)
  const rescuedIndex = rescued.findIndex((place) => place.name === selected.name)

  useEffect(() => {
    if (!mapNode.current || mapInstance.current) return
    const map = L.map(mapNode.current, { zoomControl: false, scrollWheelZoom: false }).setView([51.4887, 7.419], 14)
    mapInstance.current = map
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors', maxZoom: 19 }).addTo(map)
    residences.forEach((place) => {
      const icon = L.divIcon({ className: `rescue-map-marker ${place.rescued ? '' : 'is-waiting'}`, html: '<span></span>', iconSize: [30, 30], iconAnchor: [15, 15] })
      const marker = L.marker(place.coords, { icon }).addTo(map)
      marker.bindTooltip(place.name, { direction: 'top', offset: [0, -12], className: 'rescue-tooltip' })
      marker.on('click', () => setSelected(place))
    })
    const timer = setTimeout(() => map.invalidateSize(), 100)
    return () => { clearTimeout(timer); map.remove(); mapInstance.current = null }
  }, [])

  function focus(place) {
    setSelected(place)
    mapInstance.current?.flyTo(place.coords, 16, { duration: 0.8 })
  }

  const meta = selected.rescued ? c.metas[rescuedIndex] : pending.label
  const story = selected.rescued ? c.stories[rescuedIndex] : pending.story

  return <section className="section shell real-map-section" id="map">
    <div className="section-kicker">{c.mapKicker}</div><h2>{c.mapTitle}</h2><p className="section-sub">{c.mapSub}</p>
    <div className="real-map-shell glass"><div ref={mapNode} className="leaflet-map"/>
      <motion.aside className={`residence-feature ${selected.rescued ? '' : 'is-waiting'}`} key={selected.name} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>
        <div className="residence-photo-frame"><img src={selected.image} alt={selected.name} loading="lazy"/></div>
        <div><small>{selected.rescued ? c.selected : pending.label}</small><h3>{selected.name}</h3><span>{meta}</span><p>{story}</p></div>
      </motion.aside>
    </div>
    <div className="residence-strip">{residences.map((place) => {
      const placeIndex = rescued.findIndex((item) => item.name === place.name)
      return <button className={`${selected.name === place.name ? 'active' : ''} ${place.rescued ? '' : 'is-waiting'}`} onClick={() => focus(place)} key={place.name}>
        <img src={place.image} alt="" loading="lazy"/><span><strong>{place.name}</strong><small>{place.rescued ? c.metas[placeIndex] : pending.label}</small></span>
      </button>
    })}</div>
    <p className="map-credit">© Local DormLock photo archive · OpenStreetMap contributors</p>
  </section>
}
