import { useMemo, useState } from 'react'
import { Overlay } from '../components/Chrome'
import { AUTHOR_NOTE, DISCLAIMER, TYPE_REPORTS } from '../data/game'
import { useCopy } from '../i18n/copy'
import { useLocale } from '../i18n/locale'
import type { Scores, TypeId } from '../types'
import { scoreGap, asset } from '../utils'

const ICONS = {
  sunny: asset('weather/sunny.svg'),
  cloudy: asset('weather/cloudy.svg'),
  dust: asset('weather/dust.svg'),
  fog: asset('weather/fog.svg'),
  wind: asset('weather/wind.svg'),
} as const

const REGIONS = [
  {
    id: 'olympus' as const,
    min: -135,
    max: -55,
    skies: [
      { sky: 'bitterClear', icon: 'sunny' },
      { sky: 'highRad', icon: 'sunny' },
      { sky: 'iceFog', icon: 'fog' },
      { sky: 'dryCold', icon: 'cloudy' },
      { sky: 'jet', icon: 'wind' },
    ] as const,
  },
  {
    id: 'marineris' as const,
    min: -95,
    max: 8,
    skies: [
      { sky: 'canyonWind', icon: 'wind' },
      { sky: 'dustFilm', icon: 'dust' },
      { sky: 'swing', icon: 'wind' },
      { sky: 'localClear', icon: 'sunny' },
      { sky: 'valleyRime', icon: 'fog' },
    ] as const,
  },
  {
    id: 'hellas' as const,
    min: -75,
    max: 18,
    skies: [
      { sky: 'blowingDust', icon: 'dust' },
      { sky: 'lowPressure', icon: 'sunny' },
      { sky: 'basinHaze', icon: 'fog' },
      { sky: 'dustReturn', icon: 'dust' },
      { sky: 'afternoonWarm', icon: 'cloudy' },
    ] as const,
  },
]

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function buildForecast() {
  return REGIONS.map((region) => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const span = region.max - region.min
      const low = randInt(region.min, region.min + Math.floor(span * 0.55))
      const high = randInt(Math.min(region.max, low + 8), region.max)
      const weather = region.skies[randInt(0, region.skies.length - 1)]
      return {
        today: i === 0,
        low,
        high,
        sky: weather.sky,
        icon: ICONS[weather.icon],
      }
    })
    return { id: region.id, days }
  })
}

export function Report({
  type,
  scores,
  onReplay,
  onHome,
}: {
  type: TypeId
  scores: Scores
  onReplay: () => void
  onHome: () => void
}) {
  const t = useCopy()
  const { locale } = useLocale()
  const report = TYPE_REPORTS[type]
  const name = report.name[locale]
  const gap = scoreGap(scores)
  const consistency =
    gap >= 3
      ? { level: t.report.high, fill: 100, text: t.report.highText(name) }
      : gap === 2
        ? { level: t.report.mid, fill: 66, text: t.report.midText(name) }
        : { level: t.report.low, fill: 33, text: t.report.lowText(name) }
  const forecast = useMemo(() => buildForecast(), [])
  const [denied, setDenied] = useState(false)
  const [pdfBusy, setPdfBusy] = useState(false)

  async function downloadDossier() {
    if (pdfBusy) return
    setPdfBusy(true)
    try {
      const { saveDossierPdf } = await import('../pdf/saveDossierPdf')
      await saveDossierPdf({
        locale,
        typeId: type,
        typeName: name,
        consistency: { level: consistency.level, fill: consistency.fill },
        copy: t.print,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setPdfBusy(false)
    }
  }

  return (
    <div className={`report theme-${report.theme}`}>
      <div className="report-inner">
        <div className="report-kicker">{t.report.kicker}</div>
        <h1>{name}</h1>
        <p className="report-summary">{report.summary[locale]}</p>
        <p className="report-follow">{t.report.follow}</p>

        <section className="consistency">
          <h2>{t.report.consistency}</h2>
          <p className="consistency-q">{t.report.howClose(name)}</p>
          <div className="consistency-meter" aria-hidden="true">
            <span style={{ width: `${consistency.fill}%` }} />
          </div>
          <p className="consistency-level">{consistency.level}</p>
          <p className="consistency-text">{consistency.text}</p>
          <p className="dept-note">{t.report.dept}</p>
        </section>

        <section className="mars-guide">
          <h2>{t.report.guide}</h2>
          <h3>{t.report.globalWeather}</h3>
          <div className="weather-boards">
            {forecast.map((region) => (
              <article key={region.id} className="weather-board">
                <h4>{t.report.regions[region.id]}</h4>
                <div className="weather-scroll">
                  {region.days.map((day, index) => (
                    <div key={`${region.id}-${index}`} className="weather-col">
                      <div className="weather-day">{day.today ? t.report.today : '\u00a0'}</div>
                      <img src={day.icon} alt="" />
                      <div className="weather-temp">
                        <b>{day.high}°</b>
                        <span>{day.low}°</span>
                      </div>
                      <div className="weather-sky">{t.report.skies[day.sky]}</div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="alerts">
            <article className="alert alert-yellow">
              <div className="alert-kicker">{t.report.yellowKicker}</div>
              <h4>{t.report.yellowTitle}</h4>
              <p>{t.report.yellowBody}</p>
            </article>
            <article className="alert alert-blue">
              <div className="alert-kicker">{t.report.blueKicker}</div>
              <h4>{t.report.blueTitle}</h4>
              <p>{t.report.blueBody}</p>
            </article>
          </div>

          <button className="btn more-info" type="button" onClick={() => setDenied(true)}>
            {t.report.moreInfo}
          </button>
        </section>

        <section className="mars-transit">
          <h2>{t.report.transit}</h2>
          <div className="flight-row">
            <article className="flight-card">
              <div className="flight-top">
                <span className="flight-kind">{t.report.rail}</span>
                <strong>S6942</strong>
                <span className="flight-when">{t.report.todayShort}</span>
              </div>
              <div className="flight-route">
                <div>
                  <b>{t.report.from}</b>
                  <time>03:30</time>
                </div>
                <span className="flight-line" />
                <div>
                  <b>{t.report.to}</b>
                  <time>
                    24:35 <em>+85</em>
                  </time>
                </div>
              </div>
              <p className="flight-local">{t.report.localTime}</p>
              <p className="flight-sold">{t.report.soldOut}</p>
            </article>
            <a
              className="more-flights"
              href="https://x.com/elonmusk"
              target="_blank"
              rel="noreferrer"
              aria-label={t.report.moreFlights}
            >
              +
            </a>
          </div>
        </section>

        <div className="download-slot">
          <h3>{t.report.downloadTitle}</h3>
          <p>{t.report.downloadHint}</p>
          <button className="btn" type="button" onClick={() => void downloadDossier()} disabled={pdfBusy}>
            {pdfBusy ? t.report.downloadBusy : t.report.download}
          </button>
        </div>

        <div className="report-jumps">
          <a
            href="https://www.spacex.com/vehicles/starship/"
            target="_blank"
            rel="noreferrer"
          >
            {t.report.goMars}
          </a>
          <a
            href="https://www.fbi.gov/investigate/terrorism"
            target="_blank"
            rel="noreferrer"
          >
            {t.report.refuse}
          </a>
        </div>

        <article className="article">
          <h2>{t.report.author}</h2>
          <p>{AUTHOR_NOTE[locale]}</p>
        </article>

        <article className="article">
          <h2>{t.report.disclaimerTitle}</h2>
          <p>{DISCLAIMER[locale]}</p>
        </article>

        <div className="report-actions">
          <button className="btn" onClick={onReplay}>
            {t.report.replay}
          </button>
          <button className="btn ghost" onClick={onHome}>
            {t.report.home}
          </button>
        </div>
      </div>

      {denied && (
        <Overlay>
          <div className="modal">
            <h2 className="warn-title">{t.report.error}</h2>
            <p>{t.report.noPermission}</p>
            <div className="modal-actions">
              <button className="btn btn-red" onClick={() => setDenied(false)}>
                {t.report.close}
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  )
}
