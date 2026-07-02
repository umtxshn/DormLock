import { Home, MessageSquareText, Package, Sparkles, Trophy } from 'lucide-react'
const copy={tr:['Ana Sayfa','Hikâye','Paketler','Şöhret','Yorumlar'],de:['Start','Story','Pakete','Ruhm','Reviews'],en:['Home','Story','Packages','Fame','Reviews']}
const items=[['#top',Home],['#origin',Sparkles],['#packages',Package],['#fame',Trophy],['#reviews',MessageSquareText]]
export default function MobileNav({lang}){const labels=copy[lang]||copy.en;return <nav className="mobile-nav" aria-label="Mobile navigation">{items.map(([href,Icon],i)=><a href={href} key={href}><Icon/><span>{labels[i]}</span></a>)}</nav>}
