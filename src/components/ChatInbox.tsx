import type { Message, Passenger } from '../types'
import { MOCK_PASSENGERS } from '../data'
import { Avatar } from './ui'

function lastMessage(thread: Message[]): Message | undefined {
  return thread[thread.length - 1]
}

function timeLabel(ts: number): string {
  return new Date(ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

export function ChatInbox({
  messages,
  blockedIds,
  connectedIds,
  keptIds = [],
  onOpen,
}: {
  messages: Record<string, Message[]>
  blockedIds: string[]
  connectedIds: string[]
  keptIds?: string[]
  onOpen: (p: Passenger) => void
}) {
  const threads = Object.entries(messages)
    .filter(([id, thread]) => thread.length > 0 && !blockedIds.includes(id))
    .map(([id, thread]) => ({ passenger: MOCK_PASSENGERS.find((p) => p.id === id), thread }))
    .filter((t): t is { passenger: Passenger; thread: Message[] } => Boolean(t.passenger))
    .sort((a, b) => (lastMessage(b.thread)?.ts ?? 0) - (lastMessage(a.thread)?.ts ?? 0))

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Your chats</h2>
        <p className="text-sm text-slate-500">Conversations with passengers on this train.</p>
      </div>

      {threads.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 py-12 text-center">
          <p className="text-3xl">💬</p>
          <p className="mt-2 font-medium text-slate-600">No chats yet</p>
          <p className="mt-1 text-sm text-slate-400">Say hi to someone from Discover to start a conversation.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {threads.map(({ passenger, thread }) => {
            const last = lastMessage(thread)
            return (
              <li key={passenger.id}>
                <button
                  onClick={() => onOpen(passenger)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-50"
                >
                  <Avatar emoji={passenger.avatar} photo={passenger.photo} name={passenger.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-slate-800">{passenger.name}</p>
                      {keptIds.includes(passenger.id) && (
                        <span className="rounded-md bg-brand-100 px-1.5 py-0.5 text-xs font-medium text-brand-700">
                          kept
                        </span>
                      )}
                      {connectedIds.includes(passenger.id) && (
                        <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-700">
                          connected
                        </span>
                      )}
                      {last && <span className="ml-auto shrink-0 text-xs text-slate-400">{timeLabel(last.ts)}</span>}
                    </div>
                    <p className="truncate text-sm text-slate-500">
                      {last ? `${last.fromId === 'me' ? 'You: ' : ''}${last.text}` : ''}
                    </p>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
