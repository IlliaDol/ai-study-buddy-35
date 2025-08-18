export type Intent = 'love' | 'money' | 'education' | 'luck' | 'health' | 'travel' | 'creativity' | 'spirituality' | 'family' | 'friendship' | null

export type Step = 'welcome' | 'intent' | 'upload' | 'reading' | 'result'

export interface ReadingResult {
  symbol: string
  message: string
  ritual: string
  color: string
}
