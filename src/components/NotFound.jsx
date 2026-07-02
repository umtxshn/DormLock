import { DoorClosed, Home } from 'lucide-react'
export default function NotFound(){return <main className="not-found"><div className="glass"><DoorClosed/><span>ERROR 404 · KEY NOT FOUND</span><h1>Looks like you locked yourself out of this page.</h1><p>Fortunately, the safe corridor is only one click away.</p><a className="btn primary" href="/"><Home/>Return to safety</a></div></main>}
