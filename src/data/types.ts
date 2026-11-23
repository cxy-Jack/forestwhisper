// ---------- 测评量表 ----------
export interface ScaleOption {
  label: string
  value: number
}

export interface ScaleQuestion {
  id: number
  text: string
}

export type ScaleLevel = 'minimal' | 'mild' | 'moderate' | 'severe'

export interface ScaleResultBand {
  min: number
  max: number
  level: ScaleLevel
  title: string
  summary: string
  suggestion: string
}

export interface Scale {
  id: string
  name: string
  shortName: string
  category: '情绪' | '压力' | '睡眠' | '人际'
  description: string
  evidence: string // 信效度说明
  duration: string
  questions: ScaleQuestion[]
  options: ScaleOption[]
  bands: ScaleResultBand[]
  maxScore: number
  theme: 'amber' | 'moss' | 'mist'
}

// ---------- 文章 ----------
export interface Article {
  id: string
  kind: 'article' | 'book'
  title: string
  subtitle?: string
  author?: string
  digest: string
  content?: string[]
  evidence: string // 文献依据
  tags: string[]
  minutes: number // 阅读时长
  mood: string[] // 适配情绪
}

// ---------- 心愿 ----------
// 分类不是「情绪标签」，而是「表达类型」：允许开心、日常、秘密、想法也留在这里
export type WishMood = '开心' | '日常' | '秘密' | '想法' | '情绪' | '共鸣'

export interface Wish {
  id: string
  content: string
  mood: WishMood
  hugs: number
  reposts?: number
  views?: number
  replies: WishReply[]
  createdAt: string
  hugged?: boolean
}

export interface WishReply {
  id: string
  content: string
  createdAt: string
}

// ---------- 聊天 ----------
export interface ChatMessage {
  id: string
  role: 'user' | 'companion'
  content: string
  time: string
}

// ---------- 测评记录 ----------
export interface AssessRecord {
  scaleId: string
  scaleName: string
  score: number
  maxScore: number
  level: ScaleLevel
  levelTitle: string
  date: string
}
