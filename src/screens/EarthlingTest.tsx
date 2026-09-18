import { useState } from 'react'
import { ColorStrip, Header, Overlay, ProgressBar, QuizSlide } from '../components/Chrome'
import { useCopy } from '../i18n/copy'

export function EarthlingTest({
  showQ2Modal,
  onAnswerQ2,
  onCloseQ2,
  onFail,
}: {
  showQ2Modal: boolean
  onAnswerQ2: () => void
  onCloseQ2: () => void
  onFail: () => void
}) {
  const t = useCopy()
  const [step, setStep] = useState(0)
  const [essay, setEssay] = useState('')

  const progress = ((step + 1) / 3) * 100

  return (
    <div className="quiz-shell earthling-quiz">
      <Header />
      <ColorStrip />
      <div className="quiz-wrap">
        <div className="quiz-kicker">{t.earthling.kicker}</div>
        <ProgressBar value={progress} />

        <QuizSlide id={step}>
          {step === 0 && (
            <>
              <h1 className="quiz-title">1 + 1 = ？</h1>
              <div className="options">
                <button className="option" onClick={() => setStep(1)}>
                  2
                </button>
                <button className="option" onClick={() => setStep(1)}>
                  2
                </button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="quiz-title">3 × 5 = ？</h1>
              <div className="options">
                <button className="option" onClick={onAnswerQ2}>
                  15
                </button>
                <button className="option" onClick={onAnswerQ2}>
                  {t.earthling.dunno}
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="quiz-title">{t.earthling.exact}</h1>
              <div className="exam">
                <p>{t.earthling.q3a}</p>
                <p className="formula">S(n) = F(n)</p>
                <p>{t.earthling.q3b}</p>
                <p className="formula-block">
                  S(n) = min {'{'} k ∈ ℕ : n = x₁² + x₂² + ⋯ + xₖ² , xᵢ ∈ ℤ {'}'}
                </p>
                <p>{t.earthling.q3c}</p>
                <p>{t.earthling.q3d}</p>
              </div>
              <textarea
                className="answer-box"
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                placeholder={t.earthling.placeholder}
              />
              <div className="modal-actions">
                <button className="btn btn-green" onClick={onFail}>
                  {t.earthling.submit}
                </button>
              </div>
            </>
          )}
        </QuizSlide>
      </div>

      {showQ2Modal && (
        <Overlay>
          <div className="modal">
            <p style={{ fontSize: 18, lineHeight: 1.7, margin: 0 }}>
              {t.earthling.q2ok}
            </p>
            <div className="modal-actions">
              <button className="btn btn-green" onClick={() => { onCloseQ2(); setStep(2) }}>
                {t.earthling.continue}
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  )
}

export function TooDumbModal({ onContinue }: { onContinue: () => void }) {
  const t = useCopy()

  return (
    <Overlay blur>
      <div className="modal">
        <h2 className="warn-title">{t.tooDumb.title}</h2>
        <p>{t.tooDumb.body}</p>
        <div className="modal-actions">
          <button className="btn btn-red" onClick={onContinue}>
            {t.tooDumb.proceed}
          </button>
        </div>
      </div>
    </Overlay>
  )
}
