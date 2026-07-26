import { useState } from 'react'
import { LANDING_URL, WAITLIST_ACTION } from '../demo'
import { lang, t } from '../i18n'
import { Button } from './ui'

const PRIVACY_URL = `${LANDING_URL}datenschutz.html`

/**
 * Shown when a demo visitor taps "Say hi". Chatting isn't part of the preview,
 * so this offers the waitlist signup — entirely inside the app view (no bounce
 * back to the landing page). Posts to the same Formspree endpoint as the landing.
 */
export function SubscribeModal({ name, onClose }: { name: string; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const value = email.trim()
    if (!value) {
      setError(t('msgEmail'))
      return
    }
    if (!consent) {
      setError(t('msgConsent'))
      return
    }
    setSending(true)
    const data = new FormData()
    data.append('typ', 'Warteliste')
    data.append('source', 'Demo')
    data.append('sprache', lang)
    data.append('demo', 'ja')
    data.append('passagier', name)
    data.append('email', value)
    data.append('consent', 'ja')
    data.append('_subject', `ahola Warteliste (Demo · ${lang})`)
    fetch(WAITLIST_ACTION, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then((res) => {
        if (res.ok) {
          setDone(true)
        } else {
          return res.json().then((d: { errors?: { message: string }[] }) => {
            const msg = d?.errors?.length ? d.errors.map((x) => x.message).join(', ') : t('msgGeneric')
            throw new Error(msg)
          })
        }
      })
      .catch((err: Error) => setError(err.message || t('msgNetwork')))
      .finally(() => setSending(false))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white">
              ✓
            </div>
            <h3 className="text-lg font-semibold text-slate-800">{t('successTitle')}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-slate-600">{t('successText')}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-xl px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-600"
            >
              {t('subDone')}
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="mb-2 text-4xl">👋</div>
              <h3 className="text-lg font-semibold text-slate-800">{t('subTitle')}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-slate-600">{t('subText', { name })}</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 border-t border-slate-100 pt-4">
              <p className="mb-2 text-sm font-medium text-slate-700">{t('wlIntro')}</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPh')}
                aria-label={t('emailPh')}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-koralle"
              />
              <label className="mt-2 flex items-start gap-2 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-koralle"
                />
                <span>
                  {t('consent')}{' '}
                  <a
                    href={PRIVACY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {t('privacyLink')}
                  </a>
                </span>
              </label>
              {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
              <div className="mt-4">
                <Button type="submit" disabled={sending}>
                  {sending ? t('sending') : t('submit')}
                </Button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-sm font-medium text-slate-400 hover:text-slate-600"
              >
                {t('subClose')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
