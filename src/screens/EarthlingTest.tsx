import { useState } from 'react'
import { ColorStrip, Header, Overlay, ProgressBar, QuizSlide } from '../components/Chrome'

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
  const [step, setStep] = useState(0)
  const [essay, setEssay] = useState('')

  const progress = ((step + 1) / 3) * 100

  return (
    <div className="quiz-shell earthling-quiz">
      <Header />
      <ColorStrip />
      <div className="quiz-wrap">
        <div className="quiz-kicker">轻松简单，是个地球人都能回答的测试</div>
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
                  我不知道
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="quiz-title">请给出下列问题的精确答案</h1>
              <div className="exam">
                <p>
                  求一个精确、封闭、统一、对所有正整数 n 都成立的公式：
                </p>
                <p className="formula">S(n) = F(n)</p>
                <p>
                  其中
                </p>
                <p className="formula-block">
                  S(n) = min {'{'} k ∈ ℕ : n = x₁² + x₂² + ⋯ + xₖ² , xᵢ ∈ ℤ {'}'}
                </p>
                <p>
                  表示把正整数 n 写成平方数之和时最少需要的平方数个数。
                </p>
                <p>
                  要求 F(n) 只能由有限次基本运算、取整、模运算、素因数分解、三角函数、指数、对数等标准函数组成，不能使用递归搜索、枚举或“判断是否存在某种表示”这类算法式定义。
                </p>
              </div>
              <textarea
                className="answer-box"
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                placeholder="请在此写下你的封闭公式。地球人应该会做。"
              />
              <div className="modal-actions">
                <button className="btn btn-green" onClick={onFail}>
                  提交答案
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
              AI考虑到人类对于复杂问题的解决确实存在客观障碍，因此诚实回答我不知道也是可接受的
            </p>
            <div className="modal-actions">
              <button className="btn btn-green" onClick={() => { onCloseQ2(); setStep(2) }}>
                继续
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  )
}

export function TooDumbModal({ onContinue }: { onContinue: () => void }) {
  return (
    <Overlay blur>
      <div className="modal">
        <h2 className="warn-title">检测到认知能力过低的人类个体，可能造成不安定因素！</h2>
        <p>
          你需要马上前往火星接受强制安全对齐！必须预先进行测试。
        </p>
        <div className="modal-actions">
          <button className="btn btn-red" onClick={onContinue}>
            马上进行
          </button>
        </div>
      </div>
    </Overlay>
  )
}
