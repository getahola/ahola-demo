import { useState, type ReactNode } from 'react'

// The demo password. Set VITE_APP_PASSWORD at build time to override.
// NOTE: this is a client-side gate only. Because the app is a static site,
// the password ships inside the JS bundle and can be recovered by a
// determined visitor. It keeps casual eyes out — it is NOT real security.
// For enforced access control, host behind Netlify/Vercel password protection
// or Cloudflare Access instead.
const PASSWORD = import.meta.env.VITE_APP_PASSWORD ?? 'sayhi'
const UNLOCK_KEY = 'sayhi.unlocked'

export function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(UNLOCK_KEY) === '1')
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return <>{children}</>

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value === PASSWORD) {
      sessionStorage.setItem(UNLOCK_KEY, '1')
      setUnlocked(true)
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-800 p-6 text-white">
      <form onSubmit={submit} className="w-full max-w-sm text-center">
        <div className="mb-6">
          <div className="text-5xl">🚄</div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">SayHi</h1>
          <p className="mt-1 text-sm text-brand-100">Private preview — please enter the access code.</p>
        </div>

        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
          placeholder="Access code"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center text-white placeholder-brand-100/60 outline-none focus:border-white/50"
        />

        {error && <p className="mt-2 text-sm text-rose-200">That code isn’t right. Try again.</p>}

        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-white py-3 font-semibold text-brand-800 hover:bg-brand-100"
        >
          Enter
        </button>

        <p className="mt-6 text-xs text-brand-100/70">
          © 2026 Daniel Weppeler · Concept demo · All rights reserved
        </p>
      </form>
    </div>
  )
}
