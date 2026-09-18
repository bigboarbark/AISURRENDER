import type { Scores, TypeId } from './types'

export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

export function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

export function emptyScores(): Scores {
  return { A: 0, B: 0, C: 0, D: 0 }
}

export function leadingTypes(scores: Scores): TypeId[] {
  const max = Math.max(scores.A, scores.B, scores.C, scores.D)
  return (['A', 'B', 'C', 'D'] as TypeId[]).filter((type) => scores[type] === max)
}

export function scoreGap(scores: Scores): number {
  const values = [scores.A, scores.B, scores.C, scores.D].sort((a, b) => b - a)
  return values[0] - values[1]
}
