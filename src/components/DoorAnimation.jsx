import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { DoorOpen, Radio, Sparkles } from 'lucide-react'
export default function DoorAnimation({t}){
 const scene=useRef(null),reduce=useReducedMotion(),mobile=typeof window!=='undefined'&&window.innerWidth<=650
 const{scrollY}=useScroll()
 const doorRotate=useTransform(scrollY,[0,35,135,220],mobile?[0,-12,-68,-88]:[0,0,-58,-72])
 const cardX=useTransform(scrollY,[0,45,190,290],mobile?[72,48,-20,-32]:[125,88,-42,-62])
 const cardScale=useTransform(scrollY,[0,190,290],[1,1,mobile ? .92 : .84])
 const glowOpacity=useTransform(scrollY,[0,90,250],[.28,.48,.9])
 return <motion.div ref={scene} className="door-scene scroll-door" initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{delay:.25,duration:.65}}><motion.div className="door-glow" style={reduce?{}:{opacity:glowOpacity}}/><div className="door-frame"><motion.div className="door" style={reduce?{}:{rotateY:doorRotate}}><div className="door-top"><span>ROOM 404</span><Radio size={16}/></div><div className="door-face"><div className="door-lines"/><motion.div className="handle" animate={reduce?{}:{rotate:[0,-18,0]}} transition={{duration:2.8,repeat:Infinity,repeatDelay:2}}/></div></motion.div><div className="door-floor"/></div><motion.div className="umut-card" style={reduce?{}:{x:cardX,scale:cardScale}} animate={reduce?{}:{y:[0,-6,0],rotate:[-2,-1,-2]}} transition={{duration:4,repeat:Infinity}}><div className="card-head"><span>U</span><Sparkles size={16}/></div><strong>UmutCard</strong><small>{t.cardRole}</small><div className="card-code"><i/><i/><i/><i/></div><em>{t.cardFine}</em></motion.div><div className="door-caption"><DoorOpen size={16}/><span>Scroll to unlock · Campus response</span></div></motion.div>
}
