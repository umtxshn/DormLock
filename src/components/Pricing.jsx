import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Clock3, CupSoda, Instagram, Moon, Sandwich, Sun, Sunset, X, Zap } from 'lucide-react'

const icons = [Sun, Sunset, Moon, Zap]

const copy = {
  en: {
    title: 'Choose your rescue signal',
    text: 'How would you like to reach Umut?',
    popular: 'CAMPUS CLASSIC',
    alternative: 'ALTERNATIVE PAYMENT',
    meal: 'Döner + Ayran',
    mealText: 'Cash optional. Döner appreciated.',
    instagram: 'Message on Instagram',
  },
  tr: {
    title: 'Kurtarma sinyalini seç',
    text: "Umut'a hangi kanaldan ulaşmak istersin?",
    popular: 'KAMPÜS KLASİĞİ',
    alternative: 'ALTERNATİF ÖDEME',
    meal: 'Döner + Ayran',
    mealText: 'Nakit yerine geçmez. Ama bazen daha değerlidir.',
    instagram: 'Instagram’dan yaz',
  },
  de: {
    title: 'Wähle dein Rettungssignal',
    text: 'Wie möchtest du Umut erreichen?',
    popular: 'CAMPUS-KLASSIKER',
    alternative: 'ALTERNATIVE ZAHLUNG',
    meal: 'Döner + Ayran',
    mealText: 'Döner schlägt Bargeld manchmal. Nach vorheriger Verhandlung mit Umut.',
    instagram: 'Auf Instagram schreiben',
  },
}

export default function Pricing({ t, lang }) {
  const [selected, setSelected] = useState(null)
  const c = copy[lang] || copy.en

  return (
    <>
      <section id="packages" className="section shell">
        <div className="section-kicker">03 / FICTIONAL SERVICES</div>
        <h2>{t.pricingTitle}</h2>
        <p className="section-sub">{t.pricingSub}</p>

        <div className="pricing">
          {t.packages.map(([name, price, desc], i) => {
            const Icon = icons[i] || Clock3

            return (
              <motion.article
                className={'price-card glass ' + (i === 0 ? 'featured' : '')}
                whileHover={{ y: -8 }}
                key={name}
              >
                {i === 0 && <div className="popular">{c.popular}</div>}
                <div className="price-icon"><Icon /></div>
                <h3>{name}</h3>
                <strong>{price}</strong>
                <p>{desc}</p>
                <button type="button" onClick={() => setSelected({ name, price })}>
                  <Check size={15} />
                  {t.packageCta}
                </button>
              </motion.article>
            )
          })}
        </div>

        <motion.div className="meal-payment glass" whileHover={{ y: -3 }}>
          <div className="meal-icons"><Sandwich /><CupSoda /></div>
          <div>
            <small>{c.alternative}</small>
            <strong>{c.meal}</strong>
            <p>{c.mealText}</p>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="contact-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setSelected(null)}
          >
            <motion.div
              className="contact-modal glass"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 330, damping: 27 }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                className="contact-close"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X />
              </button>

              <div className="contact-orbit"><Instagram /></div>
              <span className="contact-kicker">{selected.price} · {selected.name}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>

              <div className="contact-options single">
                <a
                  href="https://instagram.com/dormlock.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-option instagram"
                  aria-label="Open DormLock Instagram profile"
                >
                  <span><Instagram /></span>
                  <div>
                    <strong>{c.instagram}</strong>
                    <small>dormlock.app</small>
                  </div>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}