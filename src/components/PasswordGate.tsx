import { useState, type ReactNode } from 'react'

// SHA-256 hash of the access code — the plaintext password is never stored in
// the source or the shipped bundle. Set VITE_APP_PASSWORD_HASH at build time to
// override. The default below is the hash of the local dev code ("sayhi").
// NOTE: this is still a client-side gate. Hashing hides the plaintext, but a
// determined visitor can brute-force a weak code or bypass the check entirely.
// It keeps casual eyes out — it is NOT real security. For enforced access,
// host behind Netlify/Vercel password protection or Cloudflare Access.
const PASSWORD_HASH =
  import.meta.env.VITE_APP_PASSWORD_HASH ??
  'c559477b1796a65cbc2fd7395adf85a4c80bfdb2e584f3e23a5af6cacf689be4'
const UNLOCK_KEY = 'sayhi.unlocked'

async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(UNLOCK_KEY) === '1')
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return <>{children}</>

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const hash = await sha256Hex(value)
    if (hash === PASSWORD_HASH) {
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
