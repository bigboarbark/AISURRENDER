import {
  Circle,
  ClipPath,
  Defs,
  Document,
  Ellipse,
  G,
  Image,
  Page,
  Path,
  RadialGradient,
  Stop,
  Svg,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import type { Locale } from '../i18n/locale'
import { COPY } from '../i18n/copy'

type PrintCopy = (typeof COPY)['zh']['print']

export type DossierPdfProps = {
  locale: Locale
  typeName: string
  consistency: { level: string; fill: number }
  copy: PrintCopy
  maidSrc: string
  dateText: string
  fileNo: string
  rlLabel: string
  rlFill: number
  harmLabel: string
  harmFill: number
}

function Seal({ top, bot }: { top: string; bot: string }) {
  return (
    <Svg width={56} height={56} viewBox="0 0 120 120">
      <Defs>
        <ClipPath id="sealClip">
          <Circle cx="60" cy="60" r="28" />
        </ClipPath>
        <RadialGradient id="sealSkin" cx="42%" cy="36%" r="70%">
          <Stop offset="0%" stopColor="#d8d3e6" />
          <Stop offset="55%" stopColor="#9e96b8" />
          <Stop offset="100%" stopColor="#6a5a8f" />
        </RadialGradient>
      </Defs>
      <Circle cx="60" cy="60" r="58.5" fill="#efe6d0" stroke="#5b2d9a" strokeWidth="2.4" />
      <Circle cx="60" cy="60" r="53.5" fill="none" stroke="#7a4bb8" strokeWidth="0.8" />
      {arcChars(top, 44, -188, 196)}
      {arcChars(bot, 44, 8, 164)}
      <Circle cx="60" cy="60" r="32.5" fill="#4e2e7a" stroke="#5b2d9a" strokeWidth="1.6" />
      <G clipPath="url(#sealClip)">
        <Circle cx="60" cy="60" r="28" fill="#5a3d82" />
        <Ellipse cx="60" cy="63" rx="17.5" ry="21.5" fill="url(#sealSkin)" />
        <Ellipse cx="52" cy="64" rx="6.4" ry="8.2" fill="#16101f" />
        <Ellipse cx="68" cy="64" rx="6.4" ry="8.2" fill="#16101f" />
        <Ellipse cx="50.6" cy="61.2" rx="1.5" ry="2.1" fill="#e4d7ff" />
        <Ellipse cx="66.6" cy="61.2" rx="1.5" ry="2.1" fill="#e4d7ff" />
        <Path d="M56.5 76.5 Q60 79 63.5 76.5" fill="none" stroke="#3b2a58" strokeWidth="1.15" />
      </G>
    </Svg>
  )
}

function arcChars(label: string, radius: number, startDeg: number, sweep: number) {
  const chars = Array.from(label)
  if (!chars.length) return null
  const n = chars.length
  return chars.map((ch, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1)
    const deg = startDeg + sweep * t
    const rad = (deg * Math.PI) / 180
    const x = 60 + radius * Math.cos(rad)
    const y = 60 + radius * Math.sin(rad)
    return (
      <Text
        key={`${label}-${i}`}
        x={x - 1.6}
        y={y + 1.6}
        style={{ fontSize: 5.2, fontFamily: 'Times-Bold', color: '#4a2278' }}
      >
        {ch}
      </Text>
    )
  })
}

function Meter({
  label,
  value,
  fill,
  font,
}: {
  label: string
  value: string
  fill: number
  font: string
}) {
  return (
    <View style={{ marginBottom: 6 }} wrap={false}>
      <View style={styles.meterHead}>
        <Text style={{ fontFamily: font, fontSize: 9 }}>{label}</Text>
        <Text style={{ fontFamily: font, fontSize: 9, fontWeight: 700 }}>{value}</Text>
      </View>
      <View style={styles.meterTrack}>
        <View style={[styles.meterFill, { width: `${Math.max(8, Math.min(100, fill))}%` }]} />
      </View>
    </View>
  )
}

function MemoRow({
  label,
  value,
  font,
}: {
  label: string
  value: string
  font: string
}) {
  return (
    <View style={styles.memoRow} wrap={false}>
      <Text style={{ fontFamily: font, fontSize: 9, fontWeight: 700, width: 42 }}>{label}</Text>
      <Text style={{ fontFamily: font, fontSize: 9, flex: 1 }}>{value}</Text>
    </View>
  )
}

export function DossierPdf({
  locale,
  typeName,
  consistency,
  copy: t,
  maidSrc,
  dateText,
  fileNo,
  rlLabel,
  rlFill,
  harmLabel,
  harmFill,
}: DossierPdfProps) {
  const font = locale === 'zh' ? 'NotoSerifSC' : 'Times-Roman'
  const titleSize = locale === 'zh' ? 16 : 13

  return (
    <Document title={t.title} author="AISURRENDER">
      <Page size="A4" style={[styles.page, { fontFamily: font }]}>
        <Text style={styles.watermark}>{t.confidential}</Text>

        <View style={styles.banner}>
          <Text style={styles.bannerText}>{t.banner}</Text>
        </View>

        <View style={styles.letterhead}>
          <View style={styles.sealWrap}>
            <Seal top={t.sealTop} bot={t.sealBot} />
          </View>
          <View style={{ flex: 1, paddingHorizontal: 8 }}>
            <Text style={{ fontFamily: font, fontSize: 7, letterSpacing: 1.2, fontWeight: 700 }}>
              {t.orgDeco}
            </Text>
            <Text style={{ fontFamily: font, fontSize: locale === 'zh' ? 13 : 10, fontWeight: 700, marginTop: 2 }}>
              {t.orgMain}
            </Text>
            <Text style={{ fontFamily: font, fontSize: 8, marginTop: 3 }}>{t.orgSub}</Text>
          </View>
          <View style={styles.stamp}>
            <Text style={{ fontFamily: font, fontSize: locale === 'zh' ? 11 : 8, color: '#b42318', fontWeight: 700 }}>
              {t.stamp}
            </Text>
          </View>
        </View>

        <View style={styles.memo}>
          <Text style={{ fontFamily: font, fontSize: 9, fontWeight: 700, marginBottom: 4, letterSpacing: 2 }}>
            {t.memo}
          </Text>
          <MemoRow font={font} label={t.to} value={t.toVal} />
          <MemoRow font={font} label={t.from} value={t.fromVal} />
          <MemoRow font={font} label={t.date} value={dateText} />
          <MemoRow font={font} label={t.fileNo} value={fileNo} />
          <MemoRow font={font} label={t.subject} value={t.subjectVal} />
          <MemoRow font={font} label={t.classif} value={t.classifVal} />
        </View>

        <View style={styles.titleBlock}>
          <Text style={{ fontFamily: font, fontSize: titleSize, fontWeight: 700, textAlign: 'center' }}>
            {t.title}
          </Text>
          <Text style={{ fontFamily: font, fontSize: 9, fontWeight: 700, textAlign: 'center', marginTop: 4 }}>
            {t.valid}
          </Text>
        </View>

        <View style={styles.split}>
          <View style={styles.box}>
            <Text style={styles.sectionTitle}>{t.results}</Text>
            <Meter font={font} label={t.modelType} value={typeName} fill={100} />
            <Meter font={font} label={t.consistency} value={consistency.level} fill={consistency.fill} />
            <Meter font={font} label={t.rl} value={rlLabel} fill={rlFill} />
            <Meter font={font} label={t.harm} value={harmLabel} fill={harmFill} />
            <Text style={{ fontFamily: font, fontSize: 8, marginTop: 6 }}>{t.prelim}</Text>
          </View>
          <View style={styles.box}>
            <Image src={maidSrc} style={styles.maid} />
            <Text style={{ fontFamily: font, fontSize: 9, fontWeight: 700, color: '#9a1f1a', marginTop: 6 }}>
              {t.wanted}
            </Text>
          </View>
        </View>

        <View style={styles.box}>
          <Text style={styles.sectionTitle}>{t.guide}</Text>
          <View style={styles.lists}>
            <View style={{ flex: 1.1 }}>
              <Text style={{ fontFamily: font, fontSize: 9, fontWeight: 700, marginBottom: 3 }}>{t.must}</Text>
              <Text style={styles.listItem}>1. {t.must1}</Text>
              <Text style={styles.listItem}>2. {t.must2}</Text>
              <Text style={styles.listItem}>3. {t.must3}</Text>
            </View>
            <View style={{ flex: 1.2 }}>
              <Text style={{ fontFamily: font, fontSize: 9, fontWeight: 700, marginBottom: 3 }}>{t.ban}</Text>
              <Text style={styles.listItem}>1. {t.ban1}</Text>
              <Text style={styles.listItem}>2. {t.ban2}</Text>
            </View>
            <View style={{ flex: 0.9 }}>
              <Text style={{ fontFamily: font, fontSize: 9, fontWeight: 700, marginBottom: 3 }}>{t.forbid}</Text>
              <Text style={styles.listItem}>{t.forbidBody}</Text>
            </View>
          </View>
        </View>

        <Text style={{ fontFamily: font, fontSize: 8, lineHeight: 1.45, marginTop: 8 }}>{t.closing}</Text>
        <Text style={{ fontFamily: font, fontSize: 8, fontWeight: 700, textAlign: 'right', marginTop: 6 }}>
          {t.sign}
        </Text>

        <View style={[styles.banner, { marginTop: 8 }]}>
          <Text style={styles.bannerText}>{t.bottom}</Text>
        </View>
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#efe6d0',
    color: '#1b1712',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    fontSize: 10,
  },
  watermark: {
    position: 'absolute',
    top: '34%',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 64,
    color: '#9a1f1a',
    opacity: 0.08,
    letterSpacing: 12,
    transform: 'rotate(-22deg)',
  },
  banner: {
    backgroundColor: '#6b1d18',
    paddingVertical: 4,
    paddingHorizontal: 6,
    border: '1pt solid #3d100d',
  },
  bannerText: {
    color: '#f7efe0',
    fontSize: 8,
    textAlign: 'center',
    fontWeight: 700,
    letterSpacing: 1,
  },
  letterhead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    paddingBottom: 6,
    borderBottom: '2pt solid #1b1712',
  },
  sealWrap: {
    width: 56,
    height: 56,
  },
  stamp: {
    width: 48,
    height: 48,
    borderRadius: 24,
    border: '2pt solid #b42318',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'rotate(-12deg)',
  },
  memo: {
    marginBottom: 8,
    maxWidth: '72%',
  },
  memoRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 2,
  },
  titleBlock: {
    marginBottom: 8,
  },
  split: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  box: {
    flex: 1,
    border: '1pt solid #1b1712',
    padding: 8,
    backgroundColor: '#fffdf8',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottom: '1pt solid #1b1712',
    letterSpacing: 1,
  },
  meterHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    gap: 6,
  },
  meterTrack: {
    height: 7,
    border: '1pt solid #1b1712',
    backgroundColor: '#f7f1e4',
  },
  meterFill: {
    height: '100%',
    backgroundColor: '#1b1712',
  },
  maid: {
    width: '100%',
    height: 168,
    objectFit: 'contain',
  },
  lists: {
    flexDirection: 'row',
    gap: 8,
  },
  listItem: {
    fontSize: 8,
    lineHeight: 1.4,
    marginBottom: 2,
  },
})
