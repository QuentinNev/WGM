"use client"

import { useActionState } from "react"
import { saveProfile } from "@/app/(app)/profile/actions"
import type { profiles } from "@/lib/db/schema"
import type { InferSelectModel } from "drizzle-orm"

type Profile = InferSelectModel<typeof profiles>

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [, formAction, pending] = useActionState(saveProfile, null)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Pseudo</label>
        <input
          name="pseudo"
          defaultValue={profile?.pseudo ?? ""}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Téléphone</label>
        <input
          name="phone"
          defaultValue={profile?.phone ?? ""}
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email de contact</label>
        <input
          name="contactEmail"
          type="email"
          defaultValue={profile?.contactEmail ?? ""}
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-gray-900 px-6 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  )
}