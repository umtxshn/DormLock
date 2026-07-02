import { Instagram, KeyRound } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { featureTranslations } from '../data/featureTranslations'

export default function DigitalCard({ lang }) {
  const c = featureTranslations[lang] || featureTranslations.en
  const url = typeof window === 'undefined' ? 'https://dormlock.app' : window.location.origin

  return (
    <section className="section shell digital-section" id="contact">
      <div className="section-kicker">{c.digitalKicker}</div>

      <div className="digital-card glass">
        <div className="digital-brand">
          <span>
            <KeyRound />
          </span>
          DormLock
        </div>

        <div className="digital-copy">
          <small>{c.founder}</small>
          <h2>Umut</h2>
          <p>{c.status}</p>

          <div className="digital-actions">
            <a
              href="https://instagram.com/dormlock.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram />
              dormlock.app
            </a>
          </div>
        </div>

        <div className="qr-wrap">
          <QRCodeSVG
            value={url}
            size={132}
            bgColor="transparent"
            fgColor="#11131c"
            level="M"
          />
          <small>{c.scan}</small>
        </div>
      </div>
    </section>
  )
}