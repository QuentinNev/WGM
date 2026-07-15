"use client"

import { useActionState } from "react"
import { saveProfile } from "@/app/(app)/profiles/actions"
import type { profiles } from "@/lib/db/schema"
import type { InferSelectModel } from "drizzle-orm"

type Profile = InferSelectModel<typeof profiles>

const inputClass =
  "w-full border border-screen-border bg-screen-bg px-4 py-2 text-screen-base placeholder:text-screen-muted focus:border-screen-glow focus:outline-none focus:ring-1 focus:ring-screen-glow/30 transition-colors"

const labelClass = "block text-xs text-screen-muted tracking-widest uppercase mb-1"

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [, formAction, pending] = useActionState(saveProfile, null)

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      <div>
        <label className={labelClass}>// Pseudo</label>
        <input
          name="pseudo"
          defaultValue={profile?.pseudo ?? ""}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>// Téléphone</label>
        <input
          name="phone"
          defaultValue={profile?.phone ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>// Email de contact</label>
        <input
          name="contactEmail"
          type="email"
          defaultValue={profile?.contactEmail ?? ""}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="border border-screen-glow bg-transparent px-6 py-2 text-sm text-screen-glow tracking-widest uppercase hover:bg-screen-glow/10 disabled:opacity-40 transition-colors glow-text-sm"
      >
        {pending ? "Enregistrement..." : "▶ Enregistrer"}
      </button>
    </form>
  )
}
