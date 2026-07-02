import { motion } from 'framer-motion'
import { Building2, Coffee, Crown, Pizza, Sparkles } from 'lucide-react'
import { featureTranslations } from '../data/featureTranslations'
const icons=[Building2,Coffee,Pizza,Sparkles,Crown]
export default function Achievements({lang}){const c=featureTranslations[lang]||featureTranslations.en;return <section className="section shell"><div className="section-kicker">{c.achievementKicker}</div><h2>{c.achievementTitle}</h2><div className="achievement-cards">{c.achievements.map(([title,body],i)=>{const Icon=icons[i];return <motion.article className={`glass ${i===4?'legend':''}`} key={title} whileHover={{y:-7,scale:1.01}}><span><Icon/></span><div><small>{i===4?c.legendary:c.achievementLabel}</small><h3>{title}</h3><p>{body}</p></div></motion.article>})}</div></section>}
