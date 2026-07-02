import { useEffect, useState } from 'react'
import { translations } from './data/translations'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import OriginStory from './components/OriginStory'
import Stats from './components/Stats'
import Pricing from './components/Pricing'
import HallOfFame from './components/HallOfFame'
import Achievements from './components/Achievements'
import ReviewSection from './components/ReviewSection'
import Footer from './components/Footer'
import MobileNav from './components/MobileNav'
import RescueMap from './components/RescueMap'
import LiveCounters from './components/LiveCounters'
import ProfileSection from './components/ProfileSection'
import DigitalCard from './components/DigitalCard'
import NotFound from './components/NotFound'
import './App.css'
import './contact.css'
import './mobile-fix.css'
import './mobile-compact.css'
import './mobile-navigation.css'
import './layout-refine.css'
import './scroll-door.css'
import './door-card-fix.css'
import './door-bottom.css'
import './mobile-door-open.css'
import './mobile-photo.css'
import './photo-selected.css'
import './review-photo-layout.css'
import './hero-animation-polish.css'
import './mobile-hero-separation.css'
import './feature-sections.css'
import './star-rating.css'
import './review-photo-contain.css'
import './real-map.css'

export default function App(){
  const [lang,setLang]=useState('en')
  const t={
    ...translations[lang],
    communityRating:{tr:'topluluk memnuniyet puanı',de:'Zufriedenheitswert der Community',en:'community satisfaction rating'}[lang],
    photoHint:{tr:'İsteğe bağlı · tüm görsel türleri · en fazla 5 MB',de:'Optional · alle Bildtypen · max. 5 MB',en:'Optional · all image types · max 5 MB'}[lang],
    photoError:{tr:'En fazla 5 MB boyutunda bir görsel seç.',de:'Bitte ein Bild mit maximal 5 MB wählen.',en:'Choose an image up to 5 MB.'}[lang],
    ...(lang==='en'?{originTitle:'How everything started',originText:'It all started when Umut locked himself out of his own dorm room.\nAfter finally getting back inside, friends began asking him for help.\nOne rescue became two. Two became ten.\nSoon everyone knew exactly who to call when someone forgot their key inside.\nToday DormLock is the unofficial campus rescue legend.'}:{})
  }
  useEffect(()=>{document.documentElement.lang=lang},[lang])
  if(window.location.pathname!=='/')return <NotFound/>
  return <><div className="noise"/><div className="ambient a1"/><div className="ambient a2"/><Navbar lang={lang} setLang={setLang} t={t}/><main id="top"><Hero t={t}/><OriginStory t={t}/><LiveCounters lang={lang}/><Pricing t={t} lang={lang}/><RescueMap lang={lang}/><HallOfFame t={t}/><Achievements lang={lang}/><ProfileSection lang={lang}/><ReviewSection t={t} lang={lang}/><DigitalCard lang={lang}/></main><Footer t={t}/><MobileNav lang={lang}/></>
}
