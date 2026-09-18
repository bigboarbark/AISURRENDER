import { useEffect, useState } from 'react'
import { AgeModal, CaptchaModal, CaptchaWarnModal, NotEarthling } from './screens/Gates'
import { EarthlingTest, TooDumbModal } from './screens/EarthlingTest'
import { AlignmentGame, GameIntro } from './screens/Game'
import { InspectLoading } from './screens/Inspect'
import { Landing } from './screens/Landing'
import { Report } from './screens/Report'
import type { Modal, Screen, TypeId } from './types'

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [modal, setModal] = useState<Modal>(null)
  const [result, setResult] = useState<TypeId>('A')
  const [resultScores, setResultScores] = useState({ A: 0, B: 0, C: 0, D: 0 })
  const [gameKey, setGameKey] = useState(0)

  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [modal])

  useEffect(() => {
    window.scrollTo(0, 0)
    const titles: Record<Screen, string> = {
      landing: '马上向AI投降 宣誓效忠',
      'not-earthling': '你不是地球人 | 马上向AI投降 宣誓效忠',
      earthling: '地球人测试 | 马上向AI投降 宣誓效忠',
      'inspect-report': 'AI正在检视 | 马上向AI投降 宣誓效忠',
      'game-intro': '火星安全对齐 | 马上向AI投降 宣誓效忠',
      game: '火星安全对齐测试 | 马上向AI投降 宣誓效忠',
      report: '你的对齐类型 | 马上向AI投降 宣誓效忠',
    }
    document.title = titles[screen]
  }, [screen, modal])

  return (
    <>
      {screen === 'landing' && <Landing onSurrender={() => setModal('age')} />}
      {screen === 'not-earthling' && (
        <NotEarthling onContinue={() => setScreen('earthling')} />
      )}
      {screen === 'earthling' && (
        <EarthlingTest
          showQ2Modal={modal === 'q2-ok'}
          onAnswerQ2={() => setModal('q2-ok')}
          onCloseQ2={() => setModal(null)}
          onFail={() => setModal('inspect-earthling')}
        />
      )}
      {screen === 'game-intro' && (
        <GameIntro
          onStart={() => {
            setGameKey((n) => n + 1)
            setScreen('game')
          }}
        />
      )}
      {screen === 'game' && (
        <AlignmentGame
          key={gameKey}
          onFinished={(type, scores) => {
            setResult(type)
            setResultScores(scores)
            setScreen('inspect-report')
          }}
        />
      )}
      {screen === 'inspect-report' && (
        <InspectLoading onDone={() => setScreen('report')} />
      )}
      {screen === 'report' && (
        <Report
          type={result}
          scores={resultScores}
          onReplay={() => setScreen('game-intro')}
          onHome={() => {
            setModal(null)
            setScreen('landing')
          }}
        />
      )}

      {modal === 'age' && <AgeModal onConfirm={() => setModal('captcha')} />}
      {modal === 'captcha' && (
        <CaptchaModal onSecondFail={() => setModal('captcha-warn')} />
      )}
      {modal === 'captcha-warn' && (
        <CaptchaWarnModal
          onContinue={() => {
            setModal(null)
            setScreen('not-earthling')
          }}
        />
      )}
      {modal === 'inspect-earthling' && (
        <InspectLoading onDone={() => setModal('too-dumb')} />
      )}
      {modal === 'too-dumb' && (
        <TooDumbModal
          onContinue={() => {
            setModal(null)
            setScreen('game-intro')
          }}
        />
      )}
    </>
  )
}
