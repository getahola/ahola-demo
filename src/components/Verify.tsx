import { useState } from 'react'
import type { Verification } from '../types'
import { Button, Card, Field, inputClass } from './ui'

type Step = 'consent' | 'email' | 'code'

/**
 * Mandatory verification gate. Users must confirm they're 18+, accept the
 * community guidelines, and verify an email (simulated OTP) before entering
 * the app. This is a prototype: the "code" is generated client-side and shown
 * on screen. In production this becomes a real email/SMS OTP via the backend.
 */
export function Verify({ onVerified }: { onVerified: (v: Verification) => void }) {
  const [step, setStep] = useState<Step>('consent')
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false)
  const [email, setEmail] = useState('')
  const [sentCode, setSentCode] = useState('')
  const [enteredCode, setEnteredCode] = useState('')
  const [error, setError] = useState('')

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  const sendCode = () => {
    if (!emailValid) return
    const code = String(Math.floor(100000 + Math.random() * 900000))
    setSentCode(code)
    setError('')
    setStep('code')
  }

  const confirmCode = () => {
    if (enteredCode.trim() !== sentCode) {
      setError('That code doesn’t match. Please try again.')
      return
    }
    onVerified({
      email: email.trim(),
      verifiedAt: Date.now(),
      ageConfirmed,
      guidelinesAccepted,
    })
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="text-4xl">🔒</div>
        <h2 className="mt-2 text-xl font-semibold text-slate-800">Verify to continue</h2>
        <p className="text-sm text-slate-500">
          ahola is a safe space to meet fellow travelers. A quick verification keeps the community real and
          respectful.
        </p>
      </div>

      <Stepper step={step} />

      {step === 'consent' && (
        <div className="space-y-4">
          <Card>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 accent-brand-600"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
              />
              <span className="text-sm text-slate-700">
                I confirm I am <span className="font-semibold">18 years or older</span>.
              </span>
            </label>
          </Card>

          <Card>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 accent-brand-600"
                checked={guidelinesAccepted}
                onChange={(e) => setGuidelinesAccepted(e.target.checked)}
              />
              <span className="text-sm text-slate-700">
                I agree to the <span className="font-semibold">Community Guidelines</span>: be respectful, no
                harassment, no spam. I understand I can be reported and removed.
              </span>
            </label>
          </Card>

          <ul className="space-y-1 px-1 text-xs text-slate-500">
            <li>• Only checked-in passengers on your train can see you.</li>
            <li>• You can block or report anyone, any time.</li>
            <li>• Your exact seat stays private until you both connect.</li>
          </ul>

          <Button onClick={() => setStep('email')} disabled={!ageConfirmed || !guidelinesAccepted}>
            Continue
          </Button>
        </div>
      )}

      {step === 'email' && (
        <div className="space-y-4">
          <Field label="Email address">
            <input
              className={inputClass}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </Field>
          <p className="px-1 text-xs text-slate-500">
            We’ll send a 6-digit code to confirm it’s really you. We never show your email to other passengers.
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep('consent')}>
              Back
            </Button>
            <Button onClick={sendCode} disabled={!emailValid}>
              Send code
            </Button>
          </div>
        </div>
      )}

      {step === 'code' && (
        <div className="space-y-4">
          <Card className="bg-brand-50 ring-brand-100">
            <p className="text-sm text-brand-800">
              📨 Prototype: your code is <span className="font-mono font-bold">{sentCode}</span>. In the real app
              this is emailed to <span className="font-medium">{email}</span>.
            </p>
          </Card>
          <Field label="Enter the 6-digit code">
            <input
              className={`${inputClass} tracking-[0.5em]`}
              inputMode="numeric"
              maxLength={6}
              value={enteredCode}
              onChange={(e) => {
                setEnteredCode(e.target.value.replace(/\D/g, ''))
                setError('')
              }}
              placeholder="______"
            />
          </Field>
          {error && <p className="px-1 text-sm text-rose-600">{error}</p>}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep('email')}>
              Back
            </Button>
            <Button onClick={confirmCode} disabled={enteredCode.length !== 6}>
              Verify &amp; enter
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function Stepper({ step }: { step: Step }) {
  const order: Step[] = ['consent', 'email', 'code']
  const labels: Record<Step, string> = { consent: 'Agree', email: 'Email', code: 'Confirm' }
  const activeIndex = order.indexOf(step)
  return (
    <div className="flex items-center justify-center gap-2">
      {order.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                i <= activeIndex ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {i + 1}
            </span>
            <span className={`text-xs ${i <= activeIndex ? 'text-slate-700' : 'text-slate-400'}`}>
              {labels[s]}
            </span>
          </div>
          {i < order.length - 1 && <div className="h-px w-4 bg-slate-300" />}
        </div>
      ))}
    </div>
  )
}
