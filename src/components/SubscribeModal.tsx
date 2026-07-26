import { useState } from 'react'
import { LANDING_URL, SURVEY_ACTION, WAITLIST_ACTION } from '../demo'
import { lang, t } from '../i18n'
import { Button } from './ui'

// Radio values are the canonical German strings the landing page submits, so
// demo answers line up with landing answers in Formspree regardless of UI language.
const Q1 = [
  { value: 'täglich', key: 'q1a' },
  { value: 'mehrmals im Monat', key: 'q1b' },
  { value: 'selten', key: 'q1c' },
]
const Q2 = [
  { value: 'klar, gerne', key: 'q2a' },
  { value: 'kommt drauf an', key: 'q2b' },
  { value: 'eher nicht', key: 'q2c' },
]
const Q3 = [
  { value: 'gegenseitig', key: 'q3a' },
  { value: 'thema', key: 'q3b' },
  { value: 'sicherheit', key: 'q3c' },
  { value: 'ausstieg', key: 'q3d' },
]

const PRIVACY_URL = `${LANDING_URL}datenschutz.html`

function Question({
  legend,
  options,
  name,
  value,
  onChange,
}: {
  legend: string
  options: { value: string; key: string }[]
  name: string
  value: string | null
  onChange: (v: string) => void
}) {
  return (
    <fieldset className="mb-4 last:mb-0">
      <legend className="mb-2 text-sm font-medium text-slate-700">{legend}</legend>
      <div className="flex flex-col gap-1.5">
        {options.map((o) => (
          <label
            key={o.value}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
              value === o.value
                ? 'border-koralle bg-koralle/5 text-slate-800'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="accent-koralle"
            />
            <span>{t(o.key)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/**
 * Shown when a demo visitor taps "Say hi". Chatting isn't part of the preview,
 * so this runs the same short survey + waitlist signup as the landing page —
 * but entirely inside the app view (no bounce back to the landing page). Posts
 * to the same Formspree endpoints.
 */
export function SubscribeModal({ name, onClose }: { name: string; onClose: () => void }) {
  const [freq, setFreq] = useState<string | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [cond, setCond] = useState<string | null>(null)
  const [surveySent, setSurveySent] = useState(false)

  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const needCond = open === 'kommt drauf an'
  const surveyComplete = !!freq && !!open && (!needCond || !!cond)

  // Post the survey once (fire-and-forget) as soon as it's complete.
  const maybeSubmitSurvey = (nextFreq: string | null, nextOpen: string | null, nextCond: string | null) => {
    const nc = nextOpen === 'kommt drauf an'
    if (surveySent || !nextFreq || !nextOpen || (nc && !nextCond)) return
    setSurveySent(true)
    const data = new FormData()
    data.append('typ', 'Umfrage')
    data.append('sprache', lang)
    data.append('haeufigkeit', nextFreq)
    data.append('offenheit', nextOpen)
    if (nextCond) data.append('bedingung', nextCond)
    fetch(SURVEY_ACTION, { method: 'POST', body: data, headers: { Accept: 'application/json' } }).catch(
      () => {},
    )
  }

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
    data.append('sprache', lang)
    data.append('email', value)
    data.append('consent', 'ja')
    if (freq) data.append('haeufigkeit', freq)
    if (open) data.append('offenheit', open)
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
              {t('subClose')}
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="mb-2 text-4xl">👋</div>
              <h3 className="text-lg font-semibold text-slate-800">{t('subTitle')}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-slate-600">{t('subText', { name })}</p>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="mb-3 text-xs text-slate-400">{t('surveyIntro')}</p>
              <Question
                legend={t('q1')}
                options={Q1}
                name="haeufigkeit"
                value={freq}
                onChange={(v) => {
                  setFreq(v)
                  maybeSubmitSurvey(v, open, cond)
                }}
              />
              <Question
                legend={t('q2')}
                options={Q2}
                name="offenheit"
                value={open}
                onChange={(v) => {
                  setOpen(v)
                  if (v !== 'kommt drauf an') setCond(null)
                  maybeSubmitSurvey(freq, v, v !== 'kommt drauf an' ? null : cond)
                }}
              />
              {needCond && (
                <Question
                  legend={t('q3')}
                  options={Q3}
                  name="bedingung"
                  value={cond}
                  onChange={(v) => {
                    setCond(v)
                    maybeSubmitSurvey(freq, open, v)
                  }}
                />
              )}
              {surveyComplete && (
                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  ✓ {t('surveyDone')}
                </p>
              )}
            </div>

            {surveyComplete && (
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
            )}

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
