"use client"

import { useTransition, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createDispo } from "@/app/(app)/disponibilite/actions"

type Game  = { id: string; name: string; emoji: string }
type Army  = { id: string; gameId: string; name: string }

type Props = {
  isOpen: boolean
  onClose: () => void
  games: Game[]
  armies: Army[]
}

const inputClass =
  "w-full border border-screen-border bg-screen-bg px-4 py-2 text-screen-base placeholder:text-screen-muted focus:border-screen-glow focus:outline-none focus:ring-1 focus:ring-screen-glow/30 transition-colors"

const labelClass = "block text-xs text-screen-muted tracking-widest uppercase mb-1"

export function DispoModal({ isOpen, onClose, games, armies }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedGameId, setSelectedGameId] = useState("")

  // Reset game selection when modal closes
  useEffect(() => {
    if (!isOpen) setSelectedGameId("")
  }, [isOpen])

  const filteredArmies = armies.filter((a) => a.gameId === selectedGameId)

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await createDispo(formData)
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

        {/* Header */}
        <div className="flex items-center justify-between border-b border-screen-border px-6 py-4">
          <span className="text-xs text-screen-muted tracking-widest uppercase">
            ▶ Nouvelle disponibilité
          </span>
          <button
            onClick={onClose}
            className="text-screen-muted hover:text-screen-glow transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">

          <div>
            <label className={labelClass}>// Date</label>
            <input name="date" type="date" required className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>// Début</label>
              <input name="timeStart" type="time" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>// Fin</label>
              <input name="timeEnd" type="time" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>// Jeu</label>
            <select
              name="gameId"
              required
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
              className={inputClass}
            >
              <option value="">Sélectionner un jeu</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>{g.emoji} {g.name}</option>
              ))}
            </select>
          </div>

          {filteredArmies.length > 0 && (
            <div>
              <label className={labelClass}>// Armée</label>
              <select name="armyId" className={inputClass}>
                <option value="">— Aucune</option>
                {filteredArmies.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className={labelClass}>// Format</label>
            <input
              name="format"
              type="text"
              placeholder="ex: 2000pts matched play"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>// Notes</label>
            <textarea
              name="notes"
              rows={2}
              placeholder="Niveau, lieu, précisions..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full border border-screen-glow bg-transparent py-2 text-sm text-screen-glow tracking-widest uppercase hover:bg-screen-glow/10 disabled:opacity-40 transition-colors glow-text-sm"
          >
            {isPending ? "Enregistrement..." : "▶ Créer la disponibilité"}
          </button>

        </form>
      </div>
    </div>
  )
}
