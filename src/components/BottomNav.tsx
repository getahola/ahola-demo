import type { Tab } from '../types'
import { t } from '../i18n'

const ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: t('navHome'), icon: '🏠' },
  { id: 'messages', label: t('navChats'), icon: '💬' },
  { id: 'profile', label: t('navProfile'), icon: '👤' },
  { id: 'settings', label: t('navSettings'), icon: '⚙️' },
]

export function BottomNav({
  active,
  onChange,
  chatBadge = 0,
}: {
  active: Tab
  onChange: (t: Tab) => void
  chatBadge?: number
}) {
  return (
    <nav className="sticky bottom-0 z-20 flex items-stretch justify-around border-t border-slate-200 bg-white/95 px-1 pb-2 pt-1.5 backdrop-blur">
      {ITEMS.map((it) => {
        const isActive = active === it.id
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium transition ${
              isActive ? 'text-brand-700' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className={`relative text-xl ${isActive ? 'scale-110' : ''} transition-transform`}>
              {it.icon}
              {it.id === 'messages' && chatBadge > 0 && (
                <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
                  {chatBadge}
                </span>
              )}
            </span>
            {it.label}
          </button>
        )
      })}
    </nav>
  )
}
