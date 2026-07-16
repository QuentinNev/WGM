"use client"

import { useTransition, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createOffer } from "@/app/(app)/offers/actions"

type Props = {
  isOpen: boolean
  onClose: () => void
  availabilityId: string
}

const inputClass =
  "w-full border border-screen-border bg-screen-bg px-4 py-2 text-screen-base placeholder:text-screen-muted focus:border-screen-glow focus:outline-none focus:ring-1 focus:ring-screen-glow/30 transition-colors"

const labelClass = "block text-xs text-screen-muted tracking-widest uppercase mb-1"

export function OfferModal({ isOpen, onClose, availabilityId }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  if (!isOpen) return null

  const today = new Date().toISOString().split("T")[0]

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await createOffer(formData)
      router.refresh()
      onClose()
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-screen-bg/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="mx-4 w-full max-w-md border border-screen-border bg-screen-surface glow-box">

        <div className="flex items-center justify-between border-b border-screen-border px-6 py-4">
          <span className="text-xs text-screen-muted tracking-widest uppercase">
            ▶ Nouvelle offre
          </span>
          <button onClick={onClose} className="text-screen-muted hover:text-screen-glow transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className={labelClass}>// Armée</label>
            <input
              name="army"
              type="text"
              placeholder="ex: Space Marines, Stormcast..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>// Message</label>
            <textarea
              name="message"
              rows={2}
              placeholder=""
              className={`${inputClass} resize-none`}
            />
          </div>

          <input type="hidden" name="availabilityId" value={availabilityId} />

          <button
            type="submit"
            disabled={isPending}
            className="w-full border border-screen-glow bg-transparent py-2 text-sm text-screen-glow tracking-widest uppercase hover:bg-screen-glow/10 disabled:opacity-40 transition-colors glow-text-sm"
          >
            {isPending ? "Enregistrement..." : "▶ Envoyer l'offre"}
          </button>

        </form>
      </div>
    </div>
  )
}
