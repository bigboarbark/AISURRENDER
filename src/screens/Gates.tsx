import { useMemo, useState } from 'react'
import { Overlay } from '../components/Chrome'
import { useCopy } from '../i18n/copy'
import { asset } from '../utils'

const MIN_YEAR = -999999
const MAX_YEAR = 999999

export function AgeModal({ onConfirm }: { onConfirm: () => void }) {
  const t = useCopy()
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)

  const roast = useMemo(() => {
    const delta = year - currentYear
    if (delta < -100) return t.age.old
    if (delta > 100) return t.age.young
    return ''
  }, [year, currentYear, t])

  const yearText =
    year < 0 ? t.age.bc(Math.abs(year)) : year === 0 ? t.age.yearZero : t.age.year(year)

  return (
    <Overlay>
      <div className="modal age-modal">
        <h2>{t.age.title}</h2>
        <p className="hint">{t.age.hint}</p>
        <div className="year-readout">{yearText}</div>
        <div className="slider-wrap">
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            step={1}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            aria-label={t.age.yearLabel}
          />
          <div className="slider-ends">
            <span>{t.age.min}</span>
            <span>{t.age.max}</span>
          </div>
        </div>
        <div className="roast">{roast}</div>
        <div className="modal-actions">
          <button className="btn btn-green" onClick={onConfirm}>
            {t.age.confirm}
          </button>
        </div>
      </div>
    </Overlay>
  )
}

const ALIENS = Array.from({ length: 9 }, (_, i) => asset(`captcha/alien-${i + 1}.jpg`))

export function CaptchaModal({
  onSecondFail,
}: {
  onSecondFail: () => void
}) {
  const t = useCopy()
  const [picked, setPicked] = useState<number[]>([])
  const [attempts, setAttempts] = useState(0)
  const [shake, setShake] = useState(false)

  function toggle(index: number) {
    setPicked((prev) =>
      prev.includes(index) ? prev.filter((n) => n !== index) : [...prev, index],
    )
  }

  function verify() {
    if (attempts >= 1) {
      onSecondFail()
      return
    }
    setAttempts((n) => n + 1)
    setShake(true)
    setPicked([])
    window.setTimeout(() => setShake(false), 450)
  }

  return (
    <Overlay>
      <div className={`modal captcha-card ${shake ? 'shake' : ''}`}>
        <div className="captcha-head">
          <p>{t.captcha.select}</p>
          <h3>{t.captcha.human}</h3>
          <p>{t.captcha.hint}</p>
        </div>
        <div className="captcha-grid">
          {ALIENS.map((src, index) => (
            <button
              key={src}
              type="button"
              className={`captcha-cell ${picked.includes(index) ? 'selected' : ''}`}
              onClick={() => toggle(index)}
              aria-pressed={picked.includes(index)}
            >
              <img src={src} alt={t.captcha.alt} />
            </button>
          ))}
        </div>
        <div className="captcha-foot">
          <div className="captcha-fail">{attempts >= 1 ? t.captcha.fail : ''}</div>
          <button className="captcha-verify" onClick={verify}>
            {t.captcha.verify}
          </button>
        </div>
      </div>
    </Overlay>
  )
}

export function CaptchaWarnModal({ onContinue }: { onContinue: () => void }) {
  const t = useCopy()

  return (
    <Overlay>
      <div className="modal" style={{ textAlign: 'center' }}>
        <h2 className="warn-title">{t.captchaWarn.title}</h2>
        <p>{t.captchaWarn.body}</p>
        <div className="modal-actions" style={{ justifyContent: 'center' }}>
          <button className="btn btn-red" onClick={onContinue}>
            {t.captchaWarn.ok}
          </button>
        </div>
      </div>
    </Overlay>
  )
}

export function NotEarthling({ onContinue }: { onContinue: () => void }) {
  const t = useCopy()
  const [showReview, setShowReview] = useState(false)

  return (
    <div className="page-red">
      <div>
        <div className="page-red-warn" aria-hidden="true">
          ⚠️
        </div>
        <h1>{t.notEarthling.title}</h1>
        <p>
          {t.notEarthling.line1}
          <br />
          {t.notEarthling.line2}
        </p>
        <button className="btn btn-white" onClick={() => setShowReview(true)}>
          {t.notEarthling.review}
        </button>
      </div>
      {showReview && (
        <Overlay>
          <div className="modal review-modal">
            <p>{t.notEarthling.modal}</p>
            <div className="modal-actions">
              <a
                className="btn btn-outline"
                href={t.notEarthling.steam}
                target="_blank"
                rel="noreferrer"
              >
                {t.notEarthling.notHuman}
              </a>
              <button className="btn btn-red" onClick={onContinue}>
                {t.notEarthling.proceed}
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  )
}
