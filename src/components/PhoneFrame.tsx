import { useState, type ReactNode } from 'react'

function StatusBar() {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex h-[54px] items-center justify-between px-7 text-white">
      <span className="text-[15px] font-semibold tracking-tight">{time}</span>
      <div className="flex items-center gap-1.5">
        {/* Signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* Wi-Fi */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden>
          <path d="M8.5 2.2c2.6 0 5 1 6.8 2.7l1.2-1.3C14.4 1.5 11.6.3 8.5.3S2.6 1.5.5 3.6l1.2 1.3C3.5 3.2 5.9 2.2 8.5 2.2z" />
          <path d="M8.5 5.6c1.6 0 3.1.6 4.2 1.7l1.2-1.3C12.6 4.6 10.6 3.8 8.5 3.8s-4.1.8-5.4 2.2l1.2 1.3c1.1-1.1 2.6-1.7 4.2-1.7z" />
          <path d="M8.5 9c.7 0 1.4.3 1.9.8l-1.9 2-1.9-2c.5-.5 1.2-.8 1.9-.8z" />
        </svg>
        {/* Battery */}
        <div className="flex items-center gap-0.5">
          <div className="relative h-[11px] w-[23px] rounded-[3px] border border-white/50 p-[1.5px]">
            <div className="h-full w-[75%] rounded-[1.5px] bg-white" />
          </div>
          <div className="h-[4px] w-[1.5px] rounded-r bg-white/50" />
        </div>
      </div>
    </div>
  )
}

/**
 * Realistic iPhone-style device frame (Dynamic Island, titanium edges, status
 * bar) for presenting the prototype like a real app.
 * On small screens it collapses to full-screen (no bezel) so it stays usable
 * on an actual phone; on larger screens it shows the phone mockup centered with
 * a light/dark presentation background toggle.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false)

  return (
    <>
      {/* Real phones: render app full-screen, no frame */}
      <div className="h-full sm:hidden">{children}</div>

      {/* Larger screens: show the iPhone mockup */}
      <div
        className={`hidden min-h-full items-center justify-center p-8 transition-colors sm:flex ${
          dark
            ? 'bg-gradient-to-br from-slate-900 to-slate-800'
            : 'bg-gradient-to-br from-slate-200 to-slate-300'
        }`}
      >
        {/* Background theme toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          className={`absolute right-6 top-6 z-50 flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium shadow-sm ring-1 transition ${
            dark
              ? 'bg-slate-800 text-slate-100 ring-white/10 hover:bg-slate-700'
              : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
          }`}
          title="Toggle presentation background"
        >
          {dark ? '☀️ Light' : '🌙 Dark'}
        </button>

        <div className="relative h-[844px] w-[390px]">
          {/* Outer titanium rail */}
          <div className="absolute inset-0 rounded-[3.6rem] bg-gradient-to-b from-slate-500 via-slate-700 to-slate-600 shadow-2xl" />
          {/* Inner black bezel */}
          <div className="absolute inset-[3px] rounded-[3.5rem] bg-slate-950 p-[11px]">
            {/* Screen */}
            <div className="relative h-full w-full overflow-hidden rounded-[2.9rem] bg-slate-100">
              {/* Status bar */}
              <StatusBar />
              {/* Dynamic Island */}
              <div className="pointer-events-none absolute left-1/2 top-[11px] z-40 flex h-[34px] w-[122px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-3">
                <div className="h-[9px] w-[9px] rounded-full bg-slate-800 ring-1 ring-slate-700" />
              </div>
              {/* Scrollable app viewport */}
              <div className="h-full overflow-y-auto">{children}</div>
            </div>
          </div>

          {/* Side buttons */}
          {/* Left: silent switch + volume up/down */}
          <div className="absolute -left-[2px] top-[110px] h-[26px] w-[3px] rounded-l bg-slate-800" />
          <div className="absolute -left-[3px] top-[165px] h-[52px] w-[3px] rounded-l bg-slate-600" />
          <div className="absolute -left-[3px] top-[235px] h-[52px] w-[3px] rounded-l bg-slate-600" />
          {/* Right: power button */}
          <div className="absolute -right-[3px] top-[200px] h-[78px] w-[3px] rounded-r bg-slate-600" />
        </div>
      </div>
    </>
  )
}
