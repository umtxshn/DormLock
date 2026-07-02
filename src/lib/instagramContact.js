export const INSTAGRAM_URL = 'https://instagram.com/dormlock.app'

export const instagramContactCopy = {
  tr: {
    label: 'Instagram’dan yaz',
    message: 'Sanırım ben de "Anahtar İçeride" kulübüne katıldım... Umut müsait mi?',
    success: '✅ Mesaj kopyalandı! Instagram DM’ye yapıştırman yeterli.',
    fallback: 'Instagram açıldı. Mesajı manuel yazabilirsin.',
  },
  de: {
    label: 'Auf Instagram schreiben',
    message: 'Ich bin wohl offiziell im "Schlüssel-liegt-drinnen"-Club... Ist Umut gerade frei?',
    success: '✅ Nachricht kopiert! Jetzt einfach in Instagram einfügen.',
    fallback: 'Instagram wurde geöffnet. Du kannst die Nachricht manuell schreiben.',
  },
  en: {
    label: 'Message on Instagram',
    message: 'I just joined the "Keys-Still-Inside Club"... Is Umut free?',
    success: '✅ Message copied! Just paste it into Instagram DM.',
    fallback: 'Instagram opened. You can write the message manually.',
  },
}

export async function copyInstagramMessage(lang) {
  const copy = instagramContactCopy[lang] || instagramContactCopy.en
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable')
    await navigator.clipboard.writeText(copy.message)
    return true
  } catch (error) {
    console.warn('Instagram message could not be copied:', error)
    return false
  }
}
