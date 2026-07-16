import { useEffect, useState } from 'react'
import type { Passenger } from '../types'

type Game = 'menu' | 'ttt' | 'rps' | 'wyr'

export function MiniGames({
  passenger,
  onClose,
  onShareResult,
}: {
  passenger: Passenger
  onClose: () => void
  onShareResult: (text: string) => void
}) {
  const [game, setGame] = useState<Game>('menu')

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            {game === 'menu' ? `🎮 Play with ${passenger.name}` : '🎮 Mini game'}
          </h2>
          <button
            onClick={() => (game === 'menu' ? onClose() : setGame('menu'))}
            className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
          >
            {game === 'menu' ? '✕ Close' : '← Games'}
          </button>
        </div>

        {game === 'menu' && (
          <div className="grid grid-cols-1 gap-2">
            <GameTile emoji="⭕" title="Tic-Tac-Toe" subtitle="Classic 3-in-a-row" onClick={() => setGame('ttt')} />
            <GameTile emoji="✊" title="Rock · Paper · Scissors" subtitle="Best of the ride" onClick={() => setGame('rps')} />
            <GameTile emoji="🤔" title="Would You Rather" subtitle="Fun icebreakers" onClick={() => setGame('wyr')} />
          </div>
        )}

        {game === 'ttt' && <TicTacToe passenger={passenger} onShareResult={onShareResult} />}
        {game === 'rps' && <RockPaperScissors passenger={passenger} onShareResult={onShareResult} />}
        {game === 'wyr' && <WouldYouRather passenger={passenger} onShareResult={onShareResult} />}
      </div>
    </div>
  )
}

function GameTile({
  emoji,
  title,
  subtitle,
  onClick,
}: {
  emoji: string
  title: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left ring-1 ring-slate-100 hover:bg-slate-100"
    >
      <span className="text-2xl">{emoji}</span>
      <span className="min-w-0">
        <span className="block font-semibold text-slate-800">{title}</span>
        <span className="block text-xs text-slate-500">{subtitle}</span>
      </span>
      <span className="ml-auto text-slate-300">›</span>
    </button>
  )
}

/* ------------------------------- Tic-Tac-Toe ------------------------------- */

type Cell = null | 'X' | 'O'
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function winnerOf(board: Cell[]): Cell | 'draw' | null {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  }
  return board.every(Boolean) ? 'draw' : null
}

function TicTacToe({
  passenger,
  onShareResult,
}: {
  passenger: Passenger
  onShareResult: (text: string) => void
}) {
  const [board, setBoard] = useState<Cell[]>(() => Array(9).fill(null))
  const [yourTurn, setYourTurn] = useState(true)
  const result = winnerOf(board)

  // Passenger (O) plays a random free cell shortly after your move.
  useEffect(() => {
    if (yourTurn || result) return
    const free = board.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0)
    if (free.length === 0) return
    const pick = free[Math.floor(Math.random() * free.length)]
    const t = setTimeout(() => {
      setBoard((b) => {
        if (b[pick] || winnerOf(b)) return b
        const nb = [...b]
        nb[pick] = 'O'
        return nb
      })
      setYourTurn(true)
    }, 650)
    return () => clearTimeout(t)
  }, [yourTurn, result, board])

  const play = (i: number) => {
    if (board[i] || result || !yourTurn) return
    const nb = [...board]
    nb[i] = 'X'
    setBoard(nb)
    setYourTurn(false)
  }

  const reset = () => {
    setBoard(Array(9).fill(null))
    setYourTurn(true)
  }

  const resultText =
    result === 'X'
      ? 'You won 🎉'
      : result === 'O'
        ? `${passenger.name} won`
        : result === 'draw'
          ? "It's a draw 🤝"
          : yourTurn
            ? 'Your turn (X)'
            : `${passenger.name} is thinking…`

  return (
    <div className="space-y-4">
      <p className="text-center text-sm font-medium text-slate-600">{resultText}</p>
      <div className="mx-auto grid w-52 grid-cols-3 gap-1.5">
        {board.map((c, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            disabled={!!c || !!result || !yourTurn}
            className="flex aspect-square items-center justify-center rounded-xl bg-slate-100 text-2xl font-bold text-slate-700 disabled:cursor-default enabled:hover:bg-slate-200"
          >
            {c === 'X' ? <span className="text-brand-600">✕</span> : c === 'O' ? <span className="text-rose-500">◯</span> : ''}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={reset}
          className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          Play again
        </button>
        {result && (
          <button
            onClick={() =>
              onShareResult(
                `🎮 Tic-Tac-Toe: ${
                  result === 'X' ? 'I won 😎' : result === 'O' ? 'you won! 👏' : "it's a draw 🤝"
                }`,
              )
            }
            className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            Share result
          </button>
        )}
      </div>
    </div>
  )
}

/* --------------------------- Rock · Paper · Scissors ----------------------- */

type RPS = 'rock' | 'paper' | 'scissors'
const RPS_EMOJI: Record<RPS, string> = { rock: '✊', paper: '✋', scissors: '✌️' }
const RPS_LIST: RPS[] = ['rock', 'paper', 'scissors']

function beats(a: RPS, b: RPS): boolean {
  return (
    (a === 'rock' && b === 'scissors') ||
    (a === 'paper' && b === 'rock') ||
    (a === 'scissors' && b === 'paper')
  )
}

function RockPaperScissors({
  passenger,
  onShareResult,
}: {
  passenger: Passenger
  onShareResult: (text: string) => void
}) {
  const [you, setYou] = useState<RPS | null>(null)
  const [them, setThem] = useState<RPS | null>(null)
  const [score, setScore] = useState({ you: 0, them: 0 })

  const play = (choice: RPS) => {
    const theirChoice = RPS_LIST[Math.floor(Math.random() * 3)]
    setYou(choice)
    setThem(theirChoice)
    if (beats(choice, theirChoice)) setScore((s) => ({ ...s, you: s.you + 1 }))
    else if (beats(theirChoice, choice)) setScore((s) => ({ ...s, them: s.them + 1 }))
  }

  const outcome = you && them ? (you === them ? 'tie' : beats(you, them) ? 'win' : 'lose') : null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-600">
        <span>You {score.you}</span>
        <span className="text-slate-300">·</span>
        <span>
          {passenger.name} {score.them}
        </span>
      </div>

      {you && them && (
        <div className="flex items-center justify-center gap-4 text-4xl">
          <span>{RPS_EMOJI[you]}</span>
          <span className="text-sm text-slate-400">vs</span>
          <span>{RPS_EMOJI[them]}</span>
        </div>
      )}
      <p className="text-center text-sm font-semibold text-slate-700">
        {outcome === 'win' && 'You win this round 🎉'}
        {outcome === 'lose' && `${passenger.name} wins this round`}
        {outcome === 'tie' && "It's a tie 🤝"}
        {!outcome && 'Pick your move'}
      </p>

      <div className="flex justify-center gap-2">
        {RPS_LIST.map((c) => (
          <button
            key={c}
            onClick={() => play(c)}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl hover:bg-slate-200"
          >
            {RPS_EMOJI[c]}
          </button>
        ))}
      </div>

      {(score.you > 0 || score.them > 0) && (
        <button
          onClick={() =>
            onShareResult(
              `🎮 Rock-Paper-Scissors — ${
                score.you === score.them
                  ? `all square ${score.you}:${score.them} 🤝`
                  : score.you > score.them
                    ? `I'm ahead ${score.you}:${score.them} 😏`
                    : `you're ahead ${score.them}:${score.you} 👏`
              }`,
            )
          }
          className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Share score
        </button>
      )}
    </div>
  )
}

/* ----------------------------- Would You Rather ---------------------------- */

const WYR_PROMPTS: [string, string][] = [
  ['🪟 Window seat', '🚶 Aisle seat'],
  ['☕ Coffee', '🍵 Tea'],
  ['🏔️ Mountains', '🏖️ Beach'],
  ['🌅 Early bird', '🦉 Night owl'],
  ['📚 Book', '🎧 Podcast'],
  ['🍕 Pizza', '🍣 Sushi'],
  ['✈️ Window shade up', '🌙 Shade down'],
  ['🗺️ Plan everything', '🎲 Go with the flow'],
]

function WouldYouRather({
  passenger,
  onShareResult,
}: {
  passenger: Passenger
  onShareResult: (text: string) => void
}) {
  const [index, setIndex] = useState(0)
  const [yourPick, setYourPick] = useState<number | null>(null)
  const [theirPick, setTheirPick] = useState<number | null>(null)

  const prompt = WYR_PROMPTS[index]

  const pick = (side: number) => {
    if (yourPick !== null) return
    setYourPick(side)
    setTheirPick(Math.random() < 0.5 ? 0 : 1)
  }

  const next = () => {
    setIndex((i) => (i + 1) % WYR_PROMPTS.length)
    setYourPick(null)
    setTheirPick(null)
  }

  const matched = yourPick !== null && yourPick === theirPick

  return (
    <div className="space-y-4">
      <p className="text-center text-xs font-medium uppercase tracking-wide text-slate-400">
        Would you rather…
      </p>
      <div className="grid grid-cols-2 gap-2">
        {prompt.map((option, side) => {
          const chosen = yourPick === side
          const theirs = theirPick === side
          return (
            <button
              key={side}
              onClick={() => pick(side)}
              disabled={yourPick !== null}
              className={`rounded-2xl p-4 text-center text-sm font-medium ring-1 transition ${
                chosen
                  ? 'bg-brand-600 text-white ring-brand-600'
                  : 'bg-slate-50 text-slate-700 ring-slate-100 enabled:hover:bg-slate-100'
              }`}
            >
              <span className="block">{option}</span>
              {theirs && yourPick !== null && (
                <span className={`mt-1 block text-xs ${chosen ? 'text-brand-100' : 'text-slate-400'}`}>
                  {passenger.name}'s pick
                </span>
              )}
            </button>
          )
        })}
      </div>

      {yourPick !== null && (
        <p className="text-center text-sm font-semibold text-slate-700">
          {matched ? `You both picked the same — nice match! 💚` : `${passenger.name} picked differently 😄`}
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={next}
          className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          Next question
        </button>
        {yourPick !== null && (
          <button
            onClick={() =>
              onShareResult(
                `🤔 Would you rather ${prompt[0]} or ${prompt[1]}? I picked ${prompt[yourPick]} — you?`,
              )
            }
            className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            Ask in chat
          </button>
        )}
      </div>
    </div>
  )
}
