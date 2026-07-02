import { motion } from 'framer-motion'
export default function Stats({t}) { return <section className="section shell"><div className="section-kicker">01 · FIELD DATA</div><h2>{t.statsTitle}</h2><div className="stats">{t.stats.map(([n,l],i)=><motion.div className="stat glass" key={l} whileHover={{y:-5}}><span>0{i+1}</span><strong>{n}</strong><p>{l}</p></motion.div>)}</div></section> }
