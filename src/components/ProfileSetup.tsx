import { useState } from 'react'
import type { Profile } from '../types'
import { AVATARS, INTERESTS } from '../data'
import { isDemoMode } from '../demo'
import { t, tInterest } from '../i18n'
import { uid } from '../store'
import { Avatar, Button, Field, Tag, inputClass } from './ui'

export function ProfileSetup({ initial, onSave }: { initial: Profile | null; onSave: (p: Profile) => void }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [avatar, setAvatar] = useState(initial?.avatar ?? AVATARS[0])
  const [bio, setBio] = useState(initial?.bio ?? '')
  const [lookingFor, setLookingFor] = useState(initial?.lookingFor ?? '')
  const [interests, setInterests] = useState<string[]>(initial?.interests ?? [])
  const [hideCoach, setHideCoach] = useState(initial?.hideCoach ?? false)

  const toggle = (i: string) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))

  const canSave = name.trim().length > 0 && interests.length > 0

  const submit = () => {
    if (!canSave) return
    onSave({
      id: initial?.id ?? uid(),
      name: name.trim(),
      avatar,
      bio: bio.trim(),
      lookingFor: lookingFor.trim(),
      interests,
      available: initial?.available ?? true,
      hideCoach,
    })
  }

  // In the landing-page preview the profile is fixed (Quokki) — show it read-only.
  if (isDemoMode() && initial) {
    return <ReadOnlyProfile profile={initial} />
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Your travel profile</h2>
        <p className="text-sm text-slate-500">Tell fellow passengers what you're up for on the ride.</p>
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-slate-600">Pick an avatar</span>
        <div className="flex flex-wrap gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              className={`h-11 w-11 rounded-full text-2xl transition ${
                avatar === a ? 'bg-brand-100 ring-2 ring-brand-500' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <Field label="Display name">
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex" />
      </Field>

      <Field label="Short bio">
        <input
          className={inputClass}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="One line about you"
        />
      </Field>

      <div>
        <span className="mb-2 block text-sm font-medium text-slate-600">
          Interests <span className="text-slate-400">({interests.length} selected)</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((i) => (
            <Tag key={i} label={i} active={interests.includes(i)} onClick={() => toggle(i)} />
          ))}
        </div>
      </div>

      <Field label="What I'm up for">
        <textarea
          className={`${inputClass} resize-none`}
          rows={3}
          value={lookingFor}
          onChange={(e) => setLookingFor(e.target.value)}
          placeholder="e.g. Looking for a chess partner between Frankfurt and Munich."
        />
      </Field>

      <button
        type="button"
        onClick={() => setHideCoach((v) => !v)}
        className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left hover:bg-slate-50"
      >
        <span className="text-xl">🔒</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-800">Hide my coach</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {hideCoach ? 'Stays hidden even after you connect' : 'Shown only after you connect'}
          </p>
        </div>
        <span
          aria-hidden
          className={`relative h-6 w-11 shrink-0 rounded-full transition ${hideCoach ? 'bg-brand-600' : 'bg-slate-300'}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${hideCoach ? 'left-[22px]' : 'left-0.5'}`}
          />
        </span>
      </button>

      <div className="flex items-center gap-3 pt-1">
        <Avatar emoji={avatar} />
        <div className="flex-1 text-sm text-slate-500">
          {canSave ? 'Looks good!' : 'Add a name and at least one interest to continue.'}
        </div>
        <Button onClick={submit} disabled={!canSave}>
          Save profile
        </Button>
      </div>
    </div>
  )
}

function ReadOnlyProfile({ profile }: { profile: Profile }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">{t('profileTitle')}</h2>
        <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
          🔒 {t('profileReadonly')}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Avatar emoji={profile.avatar} photo={profile.photo} name={profile.name} size="lg" />
        <p className="text-lg font-semibold text-slate-800">{profile.name}</p>
      </div>

      {profile.bio && (
        <div>
          <span className="mb-1 block text-sm font-medium text-slate-600">{t('profileBio')}</span>
          <p className="text-sm text-slate-700">{profile.bio}</p>
        </div>
      )}

      <div>
        <span className="mb-2 block text-sm font-medium text-slate-600">{t('profileInterests')}</span>
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((i) => (
            <Tag key={i} label={tInterest(i)} highlight />
          ))}
        </div>
      </div>

      {profile.lookingFor && (
        <div>
          <span className="mb-1 block text-sm font-medium text-slate-600">{t('profileLookingFor')}</span>
          <p className="text-sm text-slate-700">“{profile.lookingFor}”</p>
        </div>
      )}

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 opacity-60">
        <span className="text-xl">🔒</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-800">{t('profileHideCoach')}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {profile.hideCoach ? t('profileHideCoachOn') : t('profileHideCoachOff')}
          </p>
        </div>
        <span
          aria-hidden
          className={`relative h-6 w-11 shrink-0 rounded-full ${profile.hideCoach ? 'bg-brand-600' : 'bg-slate-300'}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${profile.hideCoach ? 'left-[22px]' : 'left-0.5'}`}
          />
        </span>
      </div>
    </div>
  )
}
