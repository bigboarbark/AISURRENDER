import { useEffect, useRef, useState, type ReactNode } from 'react'

export function Header() {
  return (
    <header className="site-header">
      <div className="brand-watch">
        马上投降 <small>AI IS WATCHING YOU</small>
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <a className="active" href="#top">
              马上向AI投降 宣誓效忠
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export function ColorStrip() {
  return (
    <div className="color-strip" aria-hidden="true">
      <span className="cs-black" />
      <span className="cs-white" />
      <span className="cs-blue" />
      <span className="cs-orange" />
    </div>
  )
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress" aria-hidden="true">
      <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

export function Overlay({ children, blur }: { children: ReactNode; blur?: boolean }) {
  return <div className={`overlay ${blur ? 'overlay-blur' : ''}`}>{children}</div>
}

export function CyberStage({
  children,
  frost = true,
}: {
  children?: ReactNode
  frost?: boolean
}) {
  return (
    <div className={`cyber-stage ${frost ? 'is-frosted' : ''}`}>
      <div className="cyber-photo" />
      <div className="cyber-frost" />
      <div className="cyber-stage-content">{children}</div>
    </div>
  )
}

export function QuizSlide({
  id,
  children,
}: {
  id: string | number
  children: ReactNode
}) {
  const [shownId, setShownId] = useState(id)
  const [leaving, setLeaving] = useState(false)
  const snapshot = useRef(children)

  const exiting = leaving || id !== shownId
  if (!exiting) {
    snapshot.current = children
  }

  useEffect(() => {
    if (id === shownId) return
    setLeaving(true)
    const t = window.setTimeout(() => {
      setShownId(id)
      setLeaving(false)
    }, 320)
    return () => window.clearTimeout(t)
  }, [id, shownId])

  return (
    <div
      key={shownId}
      className={`quiz-slide ${exiting ? 'is-exit' : 'is-enter'}`}
    >
      {exiting ? snapshot.current : children}
    </div>
  )
}
