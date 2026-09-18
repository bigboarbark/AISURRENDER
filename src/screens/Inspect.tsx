import { useEffect, useRef, useState } from 'react'

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function animateTo(
  from: number,
  to: number,
  duration: number,
  setValue: (n: number) => void,
) {
  return new Promise<void>((resolve) => {
    const start = performance.now()
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration)
      setValue(from + (to - from) * t)
      if (t < 1) {
        requestAnimationFrame(tick)
      } else {
        resolve()
      }
    }
    requestAnimationFrame(tick)
  })
}

export function InspectLoading({
  onDone,
  label = 'AI正在检视...',
  theme = 'light',
}: {
  onDone: () => void
  label?: string
  theme?: 'light' | 'dark'
}) {
  const [pct, setPct] = useState(0)
  const [text, setText] = useState(label)
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    let cancelled = false

    async function run() {
      await animateTo(0, 50, 150, (n) => {
        if (!cancelled) setPct(n)
      })
      if (cancelled) return
      await sleep(200)
      if (cancelled) return
      await animateTo(50, 99, 150, (n) => {
        if (!cancelled) setPct(n)
      })
      if (cancelled) return
      setText('快将完成...')
      await sleep(500)
      if (!cancelled) done.current()
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [label])

  return (
    <div className={`inspect-screen inspect-${theme}`}>
      <div className="inspect-page">
        <div className="inspect-card">
          <p className="inspect-kicker">inspired from mbti</p>
          <p className="inspect-label">{text}</p>
          <div
            className="inspect-bar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pct)}
          >
            <span style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
