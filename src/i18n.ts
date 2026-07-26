import { isDemoMode } from './demo'

/**
 * Lightweight i18n for the landing-page demo (`?demo=1`).
 *
 * The demo can be shown in German or English. The landing page passes the
 * visitor's chosen language into the iframe via `?lang=de|en`; we also fall
 * back to the browser language. Outside demo mode the app stays English, so the
 * full flow (verify → onboarding → chat) is unaffected — only the demo-visible
 * screens are translated.
 *
 * The language is fixed for the lifetime of a page load (it comes from the URL),
 * so a module-level constant is enough — no React context / re-render needed.
 */
export type Lang = 'de' | 'en'

export function getLang(): Lang {
  if (!isDemoMode()) return 'en'
  try {
    const p = new URLSearchParams(window.location.search).get('lang')
    if (p === 'de' || p === 'en') return p
    const nav = (navigator.language || 'en').toLowerCase()
    return nav.startsWith('de') ? 'de' : 'en'
  } catch {
    return 'en'
  }
}

export const lang: Lang = getLang()

type Vars = Record<string, string | number>
type Dict = Record<string, string>

const en: Dict = {
  // Checked-in header
  checkedIn: 'Checked in',
  ticketVerified: '✓ Ticket verified',
  coachHidden: '🔒 Coach hidden',
  leave: 'Leave',
  disabledPreview: 'Disabled in this preview',
  nowAt: 'Now at',
  arrivingAt: 'Arriving at',
  nextStop: 'Next stop · {stop}',
  finalStop: 'Final stop — your trip is ending soon',
  nextStopBtn: '⏭ Next stop',
  coachInline: 'Coach {coach}',
  coachHiddenInline: 'Coach hidden',
  seatInline: 'Seat {seat}',
  justCheckedIn: '🆕 {n} {ppl} just checked in at {stop}',
  gotOff: '👋 {n} {ppl} got off at {stop}',
  pplOne: 'passenger',
  pplMany: 'passengers',
  // Discover off
  discoverOffTitle: 'Discover me is off',
  discoverOffText:
    "You're in Do Not Disturb, so other passengers are hidden — and you don't appear to them either. Your existing chats still work.",
  turnOnDiscover: '🙋 Turn on Discover me',
  // Arrival
  arrivedTitle: "You've arrived in {stop}",
  arrivedText:
    'Your trip on {train} has ended. Everyone here has left the train and all chats have been cleared — that\u2019s how ahola keeps things private.',
  arrivedBye: 'Safe travels — see you on your next ride. 👋',
  // Filters + sections
  filterAll: 'All',
  verifiedOnly: '✓ Verified only',
  bestMatches: 'Best matches for you',
  alsoOnTrain: 'Also on this train',
  noMatch: 'No passengers match that filter.',
  // Passenger card
  inCommon: '{n} in common',
  justBoarded: '🆕 Just boarded',
  justBoardedAt: 'Just boarded at {stop}',
  verified: '✓ Verified',
  ticketVerifiedTitle: 'Ticket verified',
  coachCard: 'Coach {coach}',
  coachHiddenCard: '🔒 Coach hidden',
  coachRevealTitle: 'Exact coach is revealed once you connect',
  sayHi: '👋 Say hi',
  // Bottom nav
  navHome: 'Home',
  navChats: 'Chats',
  navProfile: 'Profile',
  navSettings: 'Settings',
  // Profile (read-only in demo)
  profileTitle: 'Your travel profile',
  profileReadonly: 'This is a preview profile — editing is disabled here.',
  profileBio: 'Short bio',
  profileInterests: 'Interests',
  profileLookingFor: 'What I’m up for',
  profileHideCoach: 'Hide my coach',
  profileHideCoachOn: 'Stays hidden even after you connect',
  profileHideCoachOff: 'Shown only after you connect',
  // Subscribe modal
  subTitle: 'This is a preview',
  subText: 'Chatting with {name} happens in the real ahola app.',
  subCta: 'Join the waitlist',
  subClose: 'Maybe later',
  // Waitlist survey + signup (mirrors the landing page)
  surveyIntro: 'A few quick questions — they help us build ahola right.',
  q1: 'How often are you on the train?',
  q1a: 'daily',
  q1b: 'several times a month',
  q1c: 'rarely',
  q2: 'Would you talk to strangers on the train?',
  q2a: 'sure, happily',
  q2b: 'depends',
  q2c: 'rather not',
  q3: 'What does it depend on?',
  q3a: 'If the other person wants to too',
  q3b: 'If there’s a concrete topic',
  q3c: 'If I feel safe',
  q3d: 'If I can leave anytime',
  surveyDone: 'Thanks! Your answer has been saved.',
  surveyPrivacy: 'Anonymous, no pressure.',
  wlIntro: 'Want to be there when ahola launches? Optional.',
  emailPh: 'you@mail.com',
  submit: 'I’m in',
  consent: 'I’d like to be notified when ahola launches. Unsubscribe anytime.',
  privacyLink: 'Privacy',
  successTitle: 'You’re on the list!',
  successText: 'Thanks — you’re on the waitlist. We’ll be in touch when ahola launches.',
  msgEmail: 'Please enter your email address.',
  msgConsent: 'Please confirm the consent to join the list.',
  msgGeneric: 'Something went wrong. Please try again later.',
  msgNetwork: 'Network error. Please try again later.',
  sending: 'Sending …',
}

const de: Dict = {
  checkedIn: 'Eingecheckt',
  ticketVerified: '✓ Ticket bestätigt',
  coachHidden: '🔒 Wagen verborgen',
  leave: 'Aussteigen',
  disabledPreview: 'In dieser Vorschau deaktiviert',
  nowAt: 'Jetzt in',
  arrivingAt: 'Ankunft in',
  nextStop: 'Nächster Halt · {stop}',
  finalStop: 'Endhalt — deine Fahrt endet gleich',
  nextStopBtn: '⏭ Nächster Halt',
  coachInline: 'Wagen {coach}',
  coachHiddenInline: 'Wagen verborgen',
  seatInline: 'Platz {seat}',
  justCheckedIn: '🆕 {n} {ppl} in {stop} eingecheckt',
  gotOff: '👋 {n} {ppl} in {stop} ausgestiegen',
  pplOne: 'Person',
  pplMany: 'Personen',
  discoverOffTitle: 'Entdecken ist aus',
  discoverOffText:
    'Du bist im Nicht-stören-Modus, also sind andere Passagiere verborgen — und du erscheinst auch bei ihnen nicht. Deine bestehenden Chats funktionieren weiter.',
  turnOnDiscover: '🙋 Entdecken einschalten',
  arrivedTitle: 'Angekommen in {stop}',
  arrivedText:
    'Deine Fahrt mit {train} ist zu Ende. Alle hier haben den Zug verlassen und alle Chats wurden gelöscht — so schützt ahola deine Privatsphäre.',
  arrivedBye: 'Gute Weiterreise — bis zur nächsten Fahrt. 👋',
  filterAll: 'Alle',
  verifiedOnly: '✓ Nur bestätigte',
  bestMatches: 'Beste Übereinstimmungen',
  alsoOnTrain: 'Auch in diesem Zug',
  noMatch: 'Keine Passagiere für diesen Filter.',
  inCommon: '{n} gemeinsam',
  justBoarded: '🆕 Neu zugestiegen',
  justBoardedAt: 'Neu zugestiegen in {stop}',
  verified: '✓ Bestätigt',
  ticketVerifiedTitle: 'Ticket bestätigt',
  coachCard: 'Wagen {coach}',
  coachHiddenCard: '🔒 Wagen verborgen',
  coachRevealTitle: 'Der genaue Wagen wird sichtbar, sobald ihr verbunden seid',
  sayHi: '👋 Hallo sagen',
  navHome: 'Start',
  navChats: 'Chats',
  navProfile: 'Profil',
  navSettings: 'Einstellungen',
  profileTitle: 'Dein Reiseprofil',
  profileReadonly: 'Das ist ein Vorschau-Profil — Bearbeiten ist hier deaktiviert.',
  profileBio: 'Kurz-Bio',
  profileInterests: 'Interessen',
  profileLookingFor: 'Worauf ich Lust habe',
  profileHideCoach: 'Wagen verbergen',
  profileHideCoachOn: 'Bleibt verborgen, auch nach dem Verbinden',
  profileHideCoachOff: 'Erst nach dem Verbinden sichtbar',
  subTitle: 'Das ist eine Vorschau',
  subText: 'Mit {name} schreiben geht in der echten ahola-App.',
  subCta: 'Auf die Warteliste',
  subClose: 'Vielleicht später',
  surveyIntro: 'Ein paar kurze Fragen — hilft uns, ahola richtig zu bauen.',
  q1: 'Wie oft bist du im Zug unterwegs?',
  q1a: 'täglich',
  q1b: 'mehrmals im Monat',
  q1c: 'selten',
  q2: 'Würdest du im Zug mit Fremden reden?',
  q2a: 'klar, gerne',
  q2b: 'kommt drauf an',
  q2c: 'eher nicht',
  q3: "Woran hängt's?",
  q3a: 'Wenn die andere Person auch will',
  q3b: 'Wenn es ein konkretes Thema gibt',
  q3c: 'Wenn ich mich sicher fühle',
  q3d: 'Wenn ich jederzeit aussteigen kann',
  surveyDone: 'Danke! Deine Antwort ist gespeichert.',
  surveyPrivacy: 'Anonym, kein Zwang.',
  wlIntro: 'Willst du dabei sein, wenn ahola startet? Freiwillig.',
  emailPh: 'deine@mail.de',
  submit: 'Ich bin dabei',
  consent: 'Ich möchte informiert werden, wenn ahola startet. Abmeldung jederzeit möglich.',
  privacyLink: 'Datenschutz',
  successTitle: 'Erfolgreich vorgemerkt!',
  successText: 'Danke — du stehst auf der Warteliste. Wir melden uns, sobald ahola startet.',
  msgEmail: 'Bitte gib deine E-Mail-Adresse ein.',
  msgConsent: 'Bitte bestätige die Einwilligung, um dich vorzumerken.',
  msgGeneric: 'Etwas ist schiefgelaufen. Bitte versuch es später erneut.',
  msgNetwork: 'Netzwerkfehler. Bitte versuch es später erneut.',
  sending: 'Senden …',
}

export function t(key: string, vars?: Vars): string {
  const dict = lang === 'de' ? de : en
  let s = dict[key] ?? en[key] ?? key
  if (vars) {
    for (const k of Object.keys(vars)) {
      s = s.split(`{${k}}`).join(String(vars[k]))
    }
  }
  return s
}

/** Plural helper for "passenger(s)" / "Person(en)". */
export function ppl(n: number): string {
  return n === 1 ? t('pplOne') : t('pplMany')
}

/** Interest labels (canonical English keys stay stable for matching/filtering). */
const INTEREST_DE: Dict = {
  Games: 'Spiele',
  'AI / Tech': 'KI / Tech',
  Career: 'Karriere',
  Books: 'Bücher',
  Coffee: 'Kaffee',
  'Language exchange': 'Sprachtandem',
  'Quiet company': 'Ruhige Gesellschaft',
  'Travel tips': 'Reisetipps',
  Music: 'Musik',
  Startups: 'Startups',
  Food: 'Essen',
  Sports: 'Sport',
}

export function tInterest(key: string): string {
  if (lang === 'de') return INTEREST_DE[key] ?? key
  return key
}

/** German bio / lookingFor for the mock passengers (by id). */
const PASSENGER_DE: Record<string, { bio: string; lookingFor: string }> = {
  p1: {
    bio: 'Data Scientist, immer für eine gute Diskussion zu haben.',
    lookingFor: 'Würde gern über die Zukunft von KI reden. Kaffee im Bordbistro?',
  },
  p2: {
    bio: 'Schach-Fan, dienstlich unterwegs.',
    lookingFor: 'Suche einen Schach- oder Kartenpartner zwischen Frankfurt und München.',
  },
  p3: {
    bio: 'Lerne Deutsch, Muttersprache Spanisch.',
    lookingFor: 'Sprachtandem? Ich helfe mit Spanisch, du mit meinem Deutsch. :)',
  },
  p4: {
    bio: 'Gründer, baue ein Klima-Startup.',
    lookingFor: 'Erzähle gern Gründer-Storys oder fachsimple über Tech.',
  },
  p5: {
    bio: 'Lese alles. Introvertiert-freundlich.',
    lookingFor: 'Ruhige Gesellschaft ist auch schön — Buchtipps sehr willkommen.',
  },
  p6: {
    bio: 'Wochenend-Fußballer, Vollzeit-Optimist.',
    lookingFor: 'Jemand Lust auf ein schnelles Quiz oder Fußball-Talk?',
  },
  p7: {
    bio: 'Illustratorin, zeichne Fremde im Zug (mit Erlaubnis!).',
    lookingFor: 'Kurze Fahrt heute — Lust auf einen schnellen Kaffee und Plausch vor Augsburg.',
  },
  p8: {
    bio: 'Doktorand, pendle zwischen Laboren.',
    lookingFor: 'Immer bereit, über Forschung zu fachsimpeln oder Paper-Tipps zu tauschen.',
  },
  p9: {
    bio: 'Fotograf, jage das goldene Licht vor dem Fenster.',
    lookingFor: 'Teile gern Geheimtipps entlang der Strecke.',
  },
  p10: {
    bio: 'Musiker, unterwegs zu einem Gig im Norden.',
    lookingFor: 'Jemand auf Indie-Musik? Freue mich über Empfehlungen für die Fahrt.',
  },
  p11: {
    bio: 'Produktdesignerin, Skizzenbuch immer offen.',
    lookingFor: 'Rede gern über Design, Startups oder den besten Kaffee an Bord.',
  },
}

export function passengerBio(id: string, fallback: string): string {
  if (lang === 'de') return PASSENGER_DE[id]?.bio ?? fallback
  return fallback
}

export function passengerLookingFor(id: string, fallback: string): string {
  if (lang === 'de') return PASSENGER_DE[id]?.lookingFor ?? fallback
  return fallback
}
