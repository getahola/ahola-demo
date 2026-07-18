import { INTERESTS } from '../data'
import { Button } from './ui'

/**
 * Marketing-style landing / home screen shown when the user taps the SayHi
 * wordmark. Explains the concept and lets them jump into the app.
 */
export function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="space-y-8 pb-4">
      {/* Hero */}
      <section className="space-y-4 pt-2 text-center">
        <div className="text-5xl">👋✨</div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          The happiest way to <span className="text-brand-600">meet people</span>
        </h1>
        <p className="mx-auto max-w-xs text-slate-500">
          Long journeys don't have to be lonely. Check in, share what you're up for, and meet
          friendly people traveling alongside you.
        </p>
        <div className="flex justify-center pt-1">
          <Button onClick={onEnter}>Get started</Button>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">How it works</h2>
        <div className="space-y-3">
          <Step n={1} title="Create your profile" text="Pick an avatar and the interests you're open to on the ride." />
          <Step n={2} title="Check in to your train" text="Enter your train number — you're only visible to others aboard." />
          <Step n={3} title="Discover & say hi" text="See who shares your interests and break the ice in a tap." />
        </div>
      </section>

      {/* Interest chips */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Whatever you're into</h2>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((i) => (
            <span key={i} className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-800 ring-1 ring-brand-100">
              {i}
            </span>
          ))}
        </div>
      </section>

      {/* Privacy note */}
      <section className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
        <p className="text-sm text-slate-600">
          🔒 <span className="font-medium">Private by design.</span> You're only discoverable while checked in,
          and you can leave any time. Block &amp; report are always one tap away.
        </p>
      </section>

      <div className="flex justify-center">
        <Button onClick={onEnter}>Enter the app →</Button>
      </div>
    </div>
  )
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 font-semibold text-white">
        {n}
      </span>
      <div>
        <p className="font-semibold text-slate-800">{title}</p>
        <p className="text-sm text-slate-500">{text}</p>
      </div>
    </div>
  )
}
