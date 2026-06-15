type BaseQuestion = {
  id: number
  category: 'JS' | 'CSS' | 'Mixto'
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export type CodeQuestion = BaseQuestion & { type: 'code'; codeSnippet: string }
export type CssQuestion = BaseQuestion & { type: 'css'; cssCode: string; htmlSnippet: string }

export type Question = CodeQuestion | CssQuestion

export type Answer = {
  questionId: number
  selectedOption: number | null
  correct: boolean
  timeRemaining: number
  pointsEarned: number
}

export type HistoryEntry = {
  date: string
  score: number
  total: number
  correct: number
}
