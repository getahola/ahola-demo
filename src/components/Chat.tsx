import { useEffect, useRef, useState } from 'react'
import type { Message, Passenger } from '../types'
import { uid } from '../store'
import { Avatar, inputClass } from './ui'
import { PassengerMenu } from './PassengerMenu'
import { MiniGames } from './MiniGames'

const ICEBREAKERS = [
  '👋 Fancy a coffee in the bord bistro?',
  'Hey! Saw we have a few things in common 🙂',
  "What are you working on during the ride?",
]

function autoReply(passenger: Passenger): string {
  const replies = [
    `Hi! Sure, ${passenger.interests[0]?.toLowerCase() ?? 'that'} sounds great 🙂`,
    "Nice to meet you! I'm in coach " + (passenger.coach ?? '?') + '. Want to meet there?',
    'Totally up for it — the ride is long enough anyway 😄',
    'Great! Grab me whenever, I have time until we arrive.',
  ]
  return replies[Math.floor(Math.random() * replies.length)]
}

export function Chat({
  passenger,
  messages,
  connected,
  onSend,
  onBack,
  onBlock,
  onReport,
}: {
  passenger: Passenger
  messages: Message[]
  connected: boolean
  onSend: (text: string) => void
  onBack: () => void
  onBlock: (p: Passenger) => void
  onReport: (p: Passenger) => void
}) {
  const [text, setText] = useState('')
  const [showGames, setShowGames] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const send = (value: string) => {
    const t = value.trim()
    if (!t) return
    onSend(t)
    setText('')
  }

  return (
    <div className="flex h-[70vh] flex-col">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <button onClick={onBack} className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100">
          ←
        </button>
        <Avatar emoji={passenger.avatar} photo={passenger.photo} name={passenger.name} />
        <div>
          <p className="font-semibold text-slate-800">{passenger.name}</p>
          <p className="text-xs text-slate-400">
            {connected && passenger.coach ? `Coach ${passenger.coach} · ` : ''}on this train
          </p>
        </div>
        <div className="ml-auto">
          <PassengerMenu onBlock={() => onBlock(passenger)} onReport={() => onReport(passenger)} />
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto py-4">
        {connected ? (
          passenger.coach && (
            <div className="mx-auto mb-2 w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
              📍 You're connected — {passenger.name} is in Coach {passenger.coach}
            </div>
          )
        ) : (
          <div className="mx-auto mb-2 w-fit rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
            🔒 Say hi to reveal each other's coach
          </div>
        )}
        {messages.length === 0 && (
          <div className="space-y-3 py-6 text-center">
            <p className="text-sm text-slate-400">Break the ice 👇</p>
            <div className="flex flex-wrap justify-center gap-2">
              {ICEBREAKERS.map((ib) => (
                <button
                  key={ib}
                  onClick={() => send(ib)}
                  className="rounded-full bg-brand-50 px-3 py-1.5 text-sm text-brand-800 ring-1 ring-brand-100 hover:bg-brand-100"
                >
                  {ib}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.fromId === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                m.fromId === 'me' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-800'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form
        className="flex gap-2 border-t border-slate-100 pt-3"
        onSubmit={(e) => {
          e.preventDefault()
          send(text)
        }}
      >
        <button
          type="button"
          onClick={() => setShowGames(true)}
          title="Play a mini game"
          className="rounded-xl bg-slate-100 px-3 text-lg hover:bg-slate-200"
        >
          🎮
        </button>
        <input
          className={inputClass}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message…"
        />
        <button
          type="submit"
          className="rounded-xl bg-koralle px-4 font-medium text-white hover:bg-koralle-600"
        >
          Send
        </button>
      </form>

      {showGames && (
        <MiniGames
          passenger={passenger}
          onClose={() => setShowGames(false)}
          onShareResult={(t) => {
            setShowGames(false)
            send(t)
          }}
        />
      )}
    </div>
  )
}

export function makeMessage(fromId: string, text: string): Message {
  return { id: uid(), fromId, text, ts: Date.now() }
}

export { autoReply }
