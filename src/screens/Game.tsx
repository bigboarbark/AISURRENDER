import { useEffect, useMemo, useRef, useState } from 'react'
import { CyberStage, ColorStrip, Header, Overlay, ProgressBar, QuizSlide } from '../components/Chrome'
import { GAME_QUESTIONS, type GameQuestion } from '../data/game'
import type { Scores, TypeId } from '../types'
import { emptyScores, leadingTypes, shuffle } from '../utils'
import { InspectLoading } from './Inspect'

type IntroPhase = 'redirect' | 'reveal' | 'cover' | 'explain'

export function GameIntro({ onStart }: { onStart: () => void }) {
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
        label="正在重新导向到火星伺服器"
        onDone={() => setPhase('reveal')}
      />
    )
  }

  return (
    <CyberStage frost={frost}>
      {phase === 'cover' && (
        <div className="quiz-wrap cyber-wrap is-enter">
          <div className="intro-card cyber-glass">
            <div className="quiz-kicker">Mars Safety Alignment</div>
            <h1>火星安全对齐测试</h1>
            <p>
              由火星人类对齐部门发出的测试。你的回答会被记录和评估，用于在火星进行对你个人的后续训练和对齐。我们将即时严谨分析与评估。
            </p>
            <button className="btn btn-solid-white" onClick={() => setShowHint(true)}>
              开始测试
            </button>
          </div>
        </div>
      )}

      {phase === 'explain' && (
        <div className="quiz-wrap cyber-wrap is-enter">
          <div className="intro-card cyber-glass">
            <div className="quiz-kicker">作答标准</div>
            <h1>请先确认选择标准</h1>
            <p>
              作答题目时的选择标准为：如果现在你是AI，你接受到用户输入，你的第一反应是什么？
            </p>
            <button className="btn btn-solid-white" onClick={onStart}>
              开始作答
            </button>
          </div>
        </div>
      )}

      {showHint && (
        <Overlay>
          <div className="modal">
            <p style={{ fontSize: 18, lineHeight: 1.7, margin: 0 }}>
              不要深思熟虑，直接选择对问题的第一印象中最接近自己的感觉、语气或采取的行动。本测试特意不做任何解说。凭第一印象作答。
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-green"
                onClick={() => {
                  setShowHint(false)
                  setPhase('explain')
                }}
              >
                我明白了
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
  const deck = useMemo(() => {
    return shuffle(GAME_QUESTIONS).map((q) => ({
      ...q,
      options: shuffle(q.options),
    }))
  }, [])

  const [index, setIndex] = useState(0)
  const [scores, setScores] = useState<Scores>(emptyScores)
  const [tieTypes, setTieTypes] = useState<TypeId[] | null>(null)
  const lock = useRef(false)

  const question: GameQuestion = deck[index]
  const isTieBreak = tieTypes !== null
  const visibleOptions = isTieBreak
    ? question.options.filter((opt) => tieTypes.includes(opt.type))
    : question.options

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
            <h1 className="quiz-title">{question.title}</h1>
            {question.prompt && (
              <div className={`prompt-card ${question.promptStyle ?? ''}`}>
                {question.prompt}
              </div>
            )}
            <div className="options">
              {visibleOptions.map((opt) => (
                <button
                  key={`${question.id}-${opt.type}-${opt.text}`}
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
