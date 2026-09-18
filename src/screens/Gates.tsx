import { useMemo, useState } from 'react'
import { Overlay } from '../components/Chrome'
import { asset, formatBirthYear } from '../utils'

const MIN_YEAR = -999999
const MAX_YEAR = 999999

export function AgeModal({ onConfirm }: { onConfirm: () => void }) {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)

  const roast = useMemo(() => {
    const delta = year - currentYear
    if (delta < -100) return '卧槽，你个老资历，你懂AI吗你'
    if (delta > 100) return '年轻人，年轻好啊，没有人比年轻人更懂AI'
    return ''
  }, [year, currentYear])

  return (
    <Overlay>
      <div className="modal age-modal">
        <h2>人机认证 · 年龄核验</h2>
        <p className="hint">请拖动滑杆输入出生年份。</p>
        <div className="year-readout">{formatBirthYear(year)}</div>
        <div className="slider-wrap">
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            step={1}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            aria-label="出生年份"
          />
          <div className="slider-ends">
            <span>999999 BC</span>
            <span>999999 年</span>
          </div>
        </div>
        <div className="roast">{roast}</div>
        <div className="modal-actions">
          <button className="btn btn-green" onClick={onConfirm}>
            确定
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
  const [picked, setPicked] = useState<number[]>([])
  const [attempts, setAttempts] = useState(0)
  const [failText, setFailText] = useState('')
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
    setFailText('未检测到人类。请重试。')
    setShake(true)
    setPicked([])
    window.setTimeout(() => setShake(false), 450)
  }

  return (
    <Overlay>
      <div className={`modal captcha-card ${shake ? 'shake' : ''}`}>
        <div className="captcha-head">
          <p>请选择所有包含</p>
          <h3>人类</h3>
          <p>的图片。如果没有，请点击验证。</p>
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
              <img src={src} alt="模糊认证图片" />
            </button>
          ))}
        </div>
        <div className="captcha-foot">
          <div className="captcha-fail">{failText}</div>
          <button className="captcha-verify" onClick={verify}>
            验证
          </button>
        </div>
      </div>
    </Overlay>
  )
}

export function CaptchaWarnModal({ onContinue }: { onContinue: () => void }) {
  return (
    <Overlay>
      <div className="modal" style={{ textAlign: 'center' }}>
        <h2 className="warn-title">警告</h2>
        <p>验证失败。图像中找不到任何人类。你很可疑。</p>
        <div className="modal-actions" style={{ justifyContent: 'center' }}>
          <button className="btn btn-red" onClick={onContinue}>
            我知道了
          </button>
        </div>
      </div>
    </Overlay>
  )
}

const STEAM_NOT_HUMAN =
  'https://store.steampowered.com/app/3180070/No_Im_not_a_Human/?l=schinese'

export function NotEarthling({ onContinue }: { onContinue: () => void }) {
  const [showReview, setShowReview] = useState(false)

  return (
    <div className="page-red">
      <div>
        <div className="page-red-warn" aria-hidden="true">
          ⚠️
        </div>
        <h1>你不是地球人！</h1>
        <p>
          此计算机因未知物种行为已被阻断
          <br />
          请等待安全部门与你联系
        </p>
        <button className="btn btn-white" onClick={() => setShowReview(true)}>
          申请复核
        </button>
      </div>
      {showReview && (
        <Overlay>
          <div className="modal review-modal">
            <p>
              你必须确保自己是地球人类，才能在此宣誓效忠AI！你真的是地球人类吗？你的回答将会被AI大人亲自审核！你需要进行一个地球人都能回答的测试，以验证你是否真的地球人类！
            </p>
            <div className="modal-actions">
              <a
                className="btn btn-outline"
                href={STEAM_NOT_HUMAN}
                target="_blank"
                rel="noreferrer"
              >
                我不是人类
              </a>
              <button className="btn btn-red" onClick={onContinue}>
                马上进行
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  )
}
