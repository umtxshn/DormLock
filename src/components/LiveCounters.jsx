import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Coffee, CreditCard, DoorOpen, Pizza } from 'lucide-react'
import { featureTranslations } from '../data/featureTranslations'
const data=[[47,DoorOpen],[31,Coffee],[4,Pizza],[1,CreditCard]]
function Counter({value}){const ref=useRef(null),visible=useInView(ref,{once:true}),[count,setCount]=useState(0);useEffect(()=>{if(!visible)return;let frame,start;const tick=t=>{start??=t;const p=Math.min((t-start)/1100,1);setCount(Math.round(value*(1-Math.pow(1-p,3))));if(p<1)frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame)},[visible,value]);return <span ref={ref}>{count}{value===47?'+':''}</span>}
export default function LiveCounters({lang}){const c=featureTranslations[lang]||featureTranslations.en;return <section className="section shell live-counter-section"><div className="section-kicker">{c.counterKicker}</div><h2>{c.counterTitle}</h2><div className="live-counters">{data.map(([n,Icon],i)=><motion.article className="glass" key={c.counters[i]} whileHover={{y:-6}}><Icon/><Counter value={n}/><p>{c.counters[i]}</p><small>0{i+1}</small></motion.article>)}</div></section>}
