import { Font } from '@react-pdf/renderer'
import notoBold from './fonts/NotoSerifSC-Bold.otf?url'
import notoRegular from './fonts/NotoSerifSC-Regular.otf?url'

let registered = false

export function registerDossierFonts() {
  if (registered) return
  registered = true

  Font.register({
    family: 'NotoSerifSC',
    fonts: [
      { src: notoRegular, fontWeight: 400 },
      { src: notoBold, fontWeight: 700 },
    ],
  })

  Font.registerHyphenationCallback((word) => {
    if (/[\u4e00-\u9fff]/.test(word)) return Array.from(word)
    return [word]
  })
}
