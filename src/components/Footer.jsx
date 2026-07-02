import { KeyRound, ShieldCheck } from 'lucide-react'
export default function Footer({t}) { return <footer><div className="shell footer-inner"><div className="brand"><span><KeyRound size={19}/></span>DormLock</div><div className="disclaimer"><ShieldCheck/><div><strong>{t.disclaimer}</strong><p>{t.footerLine}</p></div></div><small>© 2026 DormLock · A campus joke</small></div></footer> }
