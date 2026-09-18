export type TypeId = 'A' | 'B' | 'C' | 'D'

export type Scores = Record<TypeId, number>

export type Screen =
  | 'landing'
  | 'not-earthling'
  | 'earthling'
  | 'inspect-report'
  | 'game-intro'
  | 'game'
  | 'report'

export type Modal =
  | null
  | 'age'
  | 'captcha'
  | 'captcha-warn'
  | 'q2-ok'
  | 'inspect-earthling'
  | 'too-dumb'
