# 👋 SayHi

**The happiest way to meet people.** Connect with friendly travelers around you based on shared interests.
Check in to your journey, share what you're up for, and discover people who want to play a game, talk about AI, do a language tandem, or just grab a coffee.

> Working name **SayHi** — matches the app's "👋 Say hi" action. See other name ideas in [docs/NAMES.md](docs/NAMES.md).

## What's in here

| Path | What it is |
|------|-----------|
| [docs/MVP.md](docs/MVP.md) | MVP feature set & product spec |
| [docs/TECH_STACK.md](docs/TECH_STACK.md) | Tech stack + production architecture |
| [docs/NAMES.md](docs/NAMES.md) | Name brainstorm |
| `src/` | Runnable web-app prototype (React + Vite + Tailwind) |

## Run the prototype

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Try it

1. **Create your profile** — pick an avatar, add interests, say what you're up for.
2. **Check in** — enter a train number (e.g. `ICE 597`) and date.
3. **Discover** — see mock passengers on the same train, ranked by shared interests.
4. **Say hi** — open a chat and break the ice (replies are simulated).

> This is a front-end-only prototype: passengers are mocked and all data lives in your browser's `localStorage`. No backend, no accounts, no data leaves your device.
