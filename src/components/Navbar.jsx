import { KeyRound } from 'lucide-react'
export default function Navbar({ lang, setLang, t }) {
  return <nav className="nav shell"><a className="brand" href="#top"><span><KeyRound size={19}/></span>DormLock</a><div className="navlinks">{t.nav.map((x,i)=><a key={x} href={['#legend','#packages','#fame','#reviews'][i]}>{x}</a>)}</div><div className="languages">{['tr','de','en'].map(x=><button className={lang===x?'active':''} onClick={()=>setLang(x)} key={x}>{x.toUpperCase()}</button>)}</div></nav>
}
