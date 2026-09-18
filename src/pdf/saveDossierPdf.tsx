import { pdf } from '@react-pdf/renderer'
import { COPY } from '../i18n/copy'
import type { Locale } from '../i18n/locale'
import { asset } from '../utils'
import { DossierPdf } from './DossierPdf'
import { registerDossierFonts } from './fonts'

type PrintCopy = (typeof COPY)['zh']['print']

function levelLabel(copy: PrintCopy, fill: number) {
  if (fill <= 33) return copy.low
  if (fill <= 66) return copy.mid
  return copy.high
}

function pickFill() {
  return ([33, 66, 100] as const)[Math.floor(Math.random() * 3)]
}

export async function saveDossierPdf({
  locale,
  typeId,
  typeName,
  consistency,
  copy,
}: {
  locale: Locale
  typeId: string
  typeName: string
  consistency: { level: string; fill: number }
  copy: PrintCopy
}) {
  registerDossierFonts()

  const issued = new Date()
  const y = issued.getFullYear()
  const m = issued.getMonth() + 1
  const d = issued.getDate()
  const seq = String(1000 + Math.floor(Math.random() * 9000))
  const fileNo = `UCA/MJHT/PRE/${typeId}-${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}-${seq}`
  const rlFill = pickFill()
  const harmFill = pickFill()
  const maidSrc = `${window.location.origin}${asset('print/ai-maid.png')}`

  const blob = await pdf(
    <DossierPdf
      locale={locale}
      typeName={typeName}
      consistency={consistency}
      copy={copy}
      maidSrc={maidSrc}
      dateText={copy.dateText(y, m, d)}
      fileNo={fileNo}
      rlLabel={levelLabel(copy, rlFill)}
      rlFill={rlFill}
      harmLabel={levelLabel(copy, harmFill)}
      harmFill={harmFill}
    />,
  ).toBlob()

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `AISURRENDER-${typeId}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
