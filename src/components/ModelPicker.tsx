import { useState } from 'react'

const MODELS = ['Deep', 'Chat', 'Fast'] as const

export default function ModelPicker() {
  const [m, setM] = useState<typeof MODELS[number]>('Deep')
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="text-neutral-600 dark:text-neutral-300">Model</span>
      <select className="rounded-md border px-2 py-1 bg-white dark:bg-neutral-900"
        value={m} onChange={e=>setM(e.target.value as any)} aria-label="Model picker">
        {MODELS.map(x=><option key={x} value={x}>{x}</option>)}
      </select>
    </label>
  )
}
