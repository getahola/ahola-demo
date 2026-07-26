import { useEffect, useMemo, useState } from 'react'
import type { CheckIn, Message, Passenger, Profile, Report, Tab, Verification } from './types'
import { store, uid } from './store'
import { isDemoMode, DEMO_VERIFICATION, DEMO_PROFILE, DEMO_CHECKIN } from './demo'
import { MOCK_PASSENGERS } from './data'
import { ProfileSetup } from './components/ProfileSetup'
import { CheckInForm } from './components/CheckInForm'
import { Discover } from './components/Discover'
import { Chat, autoReply, makeMessage } from './components/Chat'
import { ChatInbox } from './components/ChatInbox'
import { Landing } from './components/Landing'
import { Verify } from './components/Verify'
import { ReportDialog } from './components/ReportDialog'
import { Settings } from './components/Settings'
import { TripEnd } from './components/TripEnd'
import { LeaveNotice } from './components/LeaveNotice'
import { BottomNav } from './components/BottomNav'
import { PhoneFrame } from './components/PhoneFrame'
import { Avatar } from './components/ui'
import { Logo } from './components/Logo'

export default function App() {
  const demo = isDemoMode()
  const [verification, setVerification] = useState<Verification | null>(
    () => (demo ? DEMO_VERIFICATION : store.getVerification()),
  )
  const [profile, setProfile] = useState<Profile | null>(() => (demo ? DEMO_PROFILE : store.getProfile()))
  const [checkIn, setCheckIn] = useState<CheckIn | null>(() => (demo ? DEMO_CHECKIN : store.getCheckIn()))
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => store.getMessages())
  const [activeChat, setActiveChat] = useState<Passenger | null>(null)
  const [blockedIds, setBlockedIds] = useState<string[]>(() => store.getBlocked())
  const [keptIds, setKeptIds] = useState<string[]>(() => store.getKept())
  const [reportTarget, setReportTarget] = useState<Passenger | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('home')
  const [tripEnding, setTripEnding] = useState(false)
  const [leavingNotice, setLeavingNotice] = useState<{ passengers: Passenger[]; station: string } | null>(
    null,
  )
  // New users (no saved profile yet) start on the landing/home screen.
  // In demo mode we skip straight into the app as the pre-configured Quokka.
  const [showLanding, setShowLanding] = useState(() => !demo && !store.getProfile())

  // A passenger is "connected" once you've exchanged messages both ways.
  // Exact coach/seat stays hidden until then (seat privacy).
  const connectedIds = useMemo(
    () =>
      Object.entries(messages)
        .filter(([id, thread]) => thread.some((m) => m.fromId === 'me') && thread.some((m) => m.fromId === id))
        .map(([id]) => id),
    [messages],
  )

  const gate: 'verify' | 'landing' | 'onboarding' | null = !verification
    ? 'verify'
    : showLanding
      ? 'landing'
      : !profile
        ? 'onboarding'
        : null

  // Tabs show only inside the main app (not on gates, chat or trip-end).
  const showTabs = gate === null && !activeChat && !tripEnding

  useEffect(() => {
    if (profile) store.saveProfile(profile)
  }, [profile])

  const handleVerified = (v: Verification) => {
    setVerification(v)
    store.saveVerification(v)
  }

  const handleSaveProfile = (p: Profile) => {
    setProfile(p)
    if (!showLanding) showToast('Profile saved')
  }

  const handleCheckIn = (c: CheckIn, ticketVerified?: boolean) => {
    setCheckIn(c)
    store.saveCheckIn(c)
    if (ticketVerified && profile && !profile.ticketVerified) {
      setProfile({ ...profile, ticketVerified: true })
    }
    setTab('home')
  }

  const handleEndTrip = () => {
    const connected = MOCK_PASSENGERS.filter((p) => connectedIds.includes(p.id) && !blockedIds.includes(p.id))
    setActiveChat(null)
    if (connected.length === 0) {
      finalizeTrip([])
    } else {
      setTripEnding(true)
    }
  }

  const handleConnectedLeaving = (passengers: Passenger[], station: string) => {
    setLeavingNotice({ passengers, station })
  }

  const resolveLeaving = (keep: string[]) => {
    if (!leavingNotice) return
    const noticeIds = leavingNotice.passengers.map((p) => p.id)
    const declined = noticeIds.filter((id) => !keep.includes(id))
    if (keep.length > 0) {
      const nextKept = Array.from(new Set([...keptIds, ...keep]))
      setKeptIds(nextKept)
      store.saveKept(nextKept)
    }
    if (declined.length > 0) {
      setMessages((prev) => {
        const next = Object.fromEntries(Object.entries(prev).filter(([id]) => !declined.includes(id)))
        store.saveMessages(next)
        return next
      })
    }
    const keptNames = leavingNotice.passengers.filter((p) => keep.includes(p.id)).map((p) => p.name)
    setLeavingNotice(null)
    showToast(keptNames.length > 0 ? `Kept chat with ${keptNames.join(', ')}` : 'Chat removed')
  }

  const finalizeTrip = (keep: string[]) => {
    // Clear the discovery list (check-out) and prune chats to only the kept ones.
    const prunedEntries = Object.entries(messages).filter(([id]) => keep.includes(id))
    const pruned: Record<string, Message[]> = Object.fromEntries(prunedEntries)
    setMessages(pruned)
    store.saveMessages(pruned)
    setKeptIds(keep)
    store.saveKept(keep)
    setCheckIn(null)
    store.clearCheckIn()
    setTripEnding(false)
    setTab('home')
    showToast(keep.length > 0 ? `Trip ended · kept ${keep.length} chat${keep.length > 1 ? 's' : ''}` : 'Trip ended · chats cleared')
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2600)
  }

  const handleBlock = (passenger: Passenger) => {
    const next = Array.from(new Set([...blockedIds, passenger.id]))
    setBlockedIds(next)
    store.saveBlocked(next)
    setActiveChat((c) => (c?.id === passenger.id ? null : c))
    showToast(`${passenger.name} has been blocked`)
  }

  const handleSubmitReport = (reason: string, details: string, alsoBlock: boolean) => {
    if (!reportTarget) return
    const report: Report = {
      id: uid(),
      passengerId: reportTarget.id,
      passengerName: reportTarget.name,
      reason,
      details: details || undefined,
      ts: Date.now(),
    }
    store.saveReports([...store.getReports(), report])
    const target = reportTarget
    setReportTarget(null)
    if (alsoBlock) {
      handleBlock(target)
    } else {
      showToast(`Thanks — your report about ${target.name} was sent`)
    }
  }

  const handleToggleHideCoach = () => {
    if (!profile) return
    setProfile({ ...profile, hideCoach: !profile.hideCoach })
  }

  const handleToggleAvailable = () => {
    if (!profile) return
    setProfile({ ...profile, available: !profile.available })
  }

  const handleSend = (passenger: Passenger, text: string) => {
    setMessages((prev) => {
      const thread = [...(prev[passenger.id] ?? []), makeMessage('me', text)]
      const next = { ...prev, [passenger.id]: thread }
      store.saveMessages(next)
      return next
    })
    // simulate a reply from the passenger
    setTimeout(() => {
      setMessages((prev) => {
        const thread = [...(prev[passenger.id] ?? []), makeMessage(passenger.id, autoReply(passenger))]
        const next = { ...prev, [passenger.id]: thread }
        store.saveMessages(next)
        return next
      })
    }, 900)
  }

  return (
    <PhoneFrame>
      <div className="relative mx-auto flex h-full max-w-lg flex-col overflow-hidden">
        <header className="flex items-center justify-between bg-teal px-4 pb-3 pt-4 text-white shadow-sm sm:pt-12">
          <div className="flex items-center gap-2">
            <Logo size={26} />
            <span className="text-lg font-bold tracking-tight">ahola</span>
          </div>
          {profile && !gate && (
            <button
              onClick={() => {
                setActiveChat(null)
                setTab('profile')
              }}
              className="flex items-center gap-2 rounded-full bg-white/15 py-1 pl-1 pr-3 hover:bg-white/25"
            >
              <Avatar emoji={profile.avatar} photo={profile.photo} name={profile.name} size="sm" />
              <span className="text-sm font-medium">{profile.name}</span>
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          {gate === 'verify' && <Verify onVerified={handleVerified} />}

          {gate === 'landing' && <Landing onEnter={() => setShowLanding(false)} />}

          {gate === 'onboarding' && <ProfileSetup initial={profile} onSave={handleSaveProfile} />}

          {activeChat && !gate && (
            <Chat
              passenger={activeChat}
              messages={messages[activeChat.id] ?? []}
              connected={connectedIds.includes(activeChat.id)}
              onSend={(text) => handleSend(activeChat, text)}
              onBack={() => setActiveChat(null)}
              onBlock={handleBlock}
              onReport={setReportTarget}
            />
          )}

          {tripEnding && !gate && (
            <TripEnd
              passengers={MOCK_PASSENGERS.filter((p) => connectedIds.includes(p.id) && !blockedIds.includes(p.id))}
              onDone={finalizeTrip}
            />
          )}

          {showTabs && profile && tab === 'home' && (
            checkIn ? (
              <Discover
                profile={profile}
                checkIn={checkIn}
                blockedIds={blockedIds}
                connectedIds={connectedIds}
                onOpenChat={setActiveChat}
                onLeave={handleEndTrip}
                onBlock={handleBlock}
                onReport={setReportTarget}
                onConnectedLeaving={handleConnectedLeaving}
                onEnableDiscover={handleToggleAvailable}
              />
            ) : (
              <CheckInForm onCheckIn={handleCheckIn} />
            )
          )}

          {showTabs && tab === 'messages' && (
            <ChatInbox
              messages={messages}
              blockedIds={blockedIds}
              connectedIds={connectedIds}
              keptIds={keptIds}
              onOpen={setActiveChat}
            />
          )}

          {showTabs && profile && tab === 'profile' && (
            <ProfileSetup initial={profile} onSave={handleSaveProfile} />
          )}

          {showTabs && profile && tab === 'settings' && (
            <Settings
              profile={profile}
              checkIn={checkIn}
              blockedCount={blockedIds.length}
              onToggleHideCoach={handleToggleHideCoach}
              onToggleAvailable={handleToggleAvailable}
              onEndTrip={handleEndTrip}
            />
          )}

          <p className="mt-6 pb-2 text-center text-[11px] text-slate-400">
            © 2026 ahola · Concept demo · All rights reserved
          </p>
        </main>

        {showTabs && (
          <BottomNav active={tab} onChange={(t) => { setActiveChat(null); setTab(t) }} chatBadge={connectedIds.length} />
        )}

        {reportTarget && (
          <ReportDialog
            passenger={reportTarget}
            onSubmit={handleSubmitReport}
            onClose={() => setReportTarget(null)}
          />
        )}

        {leavingNotice && (
          <LeaveNotice
            passengers={leavingNotice.passengers}
            station={leavingNotice.station}
            onDone={resolveLeaving}
          />
        )}

        {toast && (
          <div className="pointer-events-none absolute inset-x-0 bottom-20 z-50 flex justify-center px-4">
            <div className="rounded-full bg-slate-900/90 px-4 py-2 text-sm font-medium text-white shadow-lg">
              {toast}
            </div>
          </div>
        )}
      </div>
    </PhoneFrame>
  )
}
