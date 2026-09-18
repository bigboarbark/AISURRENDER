import { useEffect, useState } from 'react'
import { LangSwitch } from './components/Chrome'
import { AgeModal, CaptchaModal, CaptchaWarnModal, NotEarthling } from './screens/Gates'
import { EarthlingTest, TooDumbModal } from './screens/EarthlingTest'
import { AlignmentGame, GameIntro } from './screens/Game'
import { InspectLoading } from './screens/Inspect'
import { Landing } from './screens/Landing'
import { Report } from './screens/Report'
import { useCopy } from './i18n/copy'
import type { Modal, Screen, TypeId } from './types'

export default function App() {
  const t = useCopy()
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
  }, [screen, modal])

  useEffect(() => {
    document.title = t.titles[screen]
  }, [screen, t])

  return (
    <>
      <LangSwitch />
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
