import { useState } from 'react'
import type { Profile } from '../types'
import { AVATARS, INTERESTS } from '../data'
import { uid } from '../store'
import { Avatar, Button, Field, Tag, inputClass } from './ui'

export function ProfileSetup({ initial, onSave }: { initial: Profile | null; onSave: (p: Profile) => void }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [avatar, setAvatar] = useState(initial?.avatar ?? AVATARS[0])
  const [bio, setBio] = useState(initial?.bio ?? '')
  const [lookingFor, setLookingFor] = useState(initial?.lookingFor ?? '')
  const [interests, setInterests] = useState<string[]>(initial?.interests ?? [])

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
    })
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
