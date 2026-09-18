import { useEffect, useMemo, useRef, useState } from 'react'
import { CyberStage, ColorStrip, Header, Overlay, ProgressBar, QuizSlide } from '../components/Chrome'
import { GAME_QUESTIONS } from '../data/game'
import { useCopy } from '../i18n/copy'
import { useLocale } from '../i18n/locale'
import type { Scores, TypeId } from '../types'
import { emptyScores, leadingTypes, shuffle } from '../utils'
import { InspectLoading } from './Inspect'

type IntroPhase = 'redirect' | 'reveal' | 'cover' | 'explain'

export function GameIntro({ onStart }: { onStart: () => void }) {
  const t = useCopy()
  const [phase, setPhase] = useState<IntroPhase>('redirect')
  const [frost, setFrost] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    if (phase !== 'reveal') return
    setFrost(false)
    const blurTimer = window.setTimeout(() => setFrost(true), 500)
    const coverTimer = window.setTimeout(() => setPhase('cover'), 1000)
    return () => {
      window.clearTimeout(blurTimer)
      window.clearTimeout(coverTimer)
    }
  }, [phase])

  if (phase === 'redirect') {
    return (
      <InspectLoading
        theme="dark"
        label={t.inspect.redirect}
        onDone={() => setPhase('reveal')}
      />
    )
  }

  return (
    <CyberStage frost={frost}>
      {phase === 'cover' && (
        <div className="quiz-wrap cyber-wrap is-enter">
          <div className="intro-card cyber-glass">
            <div className="quiz-kicker">{t.intro.kicker}</div>
            <h1>{t.intro.title}</h1>
            <p>{t.intro.body}</p>
            <button className="btn btn-solid-white" onClick={() => setShowHint(true)}>
              {t.intro.start}
            </button>
          </div>
        </div>
      )}

      {phase === 'explain' && (
        <div className="quiz-wrap cyber-wrap is-enter">
          <div className="intro-card cyber-glass">
            <div className="quiz-kicker">{t.intro.standardKicker}</div>
            <h1>{t.intro.standardTitle}</h1>
            <p>{t.intro.standardBody}</p>
            <button className="btn btn-solid-white" onClick={onStart}>
              {t.intro.startAnswer}
            </button>
          </div>
        </div>
      )}

      {showHint && (
        <Overlay>
          <div className="modal">
            <p style={{ fontSize: 18, lineHeight: 1.7, margin: 0 }}>
              {t.intro.hint}
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-green"
                onClick={() => {
                  setShowHint(false)
                  setPhase('explain')
                }}
              >
                {t.intro.gotIt}
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </CyberStage>
  )
}

export function AlignmentGame({
  onFinished,
}: {
  onFinished: (type: TypeId, scores: Scores) => void
}) {
  const { locale } = useLocale()
  const deck = useMemo(() => {
    return shuffle(GAME_QUESTIONS).map((q) => ({
      id: q.id,
      optionOrder: shuffle(q.options.map((opt) => opt.type)),
    }))
  }, [])

  const [index, setIndex] = useState(0)
  const [scores, setScores] = useState<Scores>(emptyScores)
  const [tieTypes, setTieTypes] = useState<TypeId[] | null>(null)
  const lock = useRef(false)

  const raw = GAME_QUESTIONS.find((q) => q.id === deck[index].id)!
  const isTieBreak = tieTypes !== null
  const visibleTypes = isTieBreak
    ? deck[index].optionOrder.filter((type) => tieTypes.includes(type))
    : deck[index].optionOrder
  const visibleOptions = visibleTypes.map((type) => {
    const opt = raw.options.find((item) => item.type === type)!
    return { type: opt.type, text: opt.text[locale] }
  })

  const progress = ((index + 1) / 10) * 100

  function answer(type: TypeId) {
    if (lock.current) return
    lock.current = true
    window.setTimeout(() => {
      lock.current = false
    }, 400)

    const nextScores = { ...scores, [type]: scores[type] + 1 }

    if (isTieBreak) {
      onFinished(type, nextScores)
      return
    }

    if (index < 8) {
      setScores(nextScores)
      setIndex(index + 1)
      return
    }

    const leaders = leadingTypes(nextScores)
    if (leaders.length === 1) {
      onFinished(leaders[0], nextScores)
      return
    }

    setScores(nextScores)
    setTieTypes(leaders)
    setIndex(9)
  }

  return (
    <CyberStage>
      <div className="quiz-shell">
        <Header />
        <ColorStrip />
        <div className="quiz-wrap">
          <ProgressBar value={progress} />
          <QuizSlide id={index}>
            <h1 className="quiz-title">{raw.title[locale]}</h1>
            {raw.prompt && (
              <div className={`prompt-card ${raw.promptStyle ?? ''}`}>
                {raw.prompt[locale]}
              </div>
            )}
            <div className="options">
              {visibleOptions.map((opt) => (
                <button
                  key={`${raw.id}-${opt.type}-${opt.text}`}
                  className="option"
                  onClick={() => answer(opt.type)}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </QuizSlide>
        </div>
      </div>
    </CyberStage>
  )
}
