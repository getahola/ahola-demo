import type { ReactNode } from 'react'

export function Avatar({ emoji, size = 'md' }: { emoji: string; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'h-16 w-16 text-3xl' : size === 'sm' ? 'h-8 w-8 text-lg' : 'h-11 w-11 text-2xl'
  return (
    <span className={`inline-flex ${cls} items-center justify-center rounded-full bg-brand-100 ring-1 ring-brand-500/20`}>
      {emoji}
    </span>
  )
}

export function Tag({
  label,
  active,
  onClick,
  highlight,
}: {
  label: string
  active?: boolean
  onClick?: () => void
  highlight?: boolean
}) {
  const base = 'rounded-full px-3 py-1 text-sm transition select-none'
  const style = active
    ? 'bg-brand-600 text-white'
    : highlight
      ? 'bg-brand-100 text-brand-800 ring-1 ring-brand-500/30'
      : 'bg-slate-100 text-slate-600'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${style} ${onClick ? 'hover:opacity-90 active:scale-95 cursor-pointer' : 'cursor-default'}`}
    >
      {label}
    </button>
  )
}

export function Button({
  children,
  onClick,
  disabled,
  variant = 'primary',
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'ghost' | 'danger'
  type?: 'button' | 'submit'
}) {
  const styles: Record<string, string> = {
    primary: 'bg-koralle text-white hover:bg-koralle-600 disabled:bg-slate-300',
    ghost: 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
    danger: 'bg-rose-50 text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-4 py-2.5 font-medium transition active:scale-[0.98] disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 ${className}`}>{children}</div>
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-600">{label}</span>
      {children}
    </label>
  )
}

export const inputClass =
  'w-full rounded-xl border-0 bg-slate-100 px-4 py-2.5 text-slate-800 outline-none ring-1 ring-transparent focus:bg-white focus:ring-brand-500'
