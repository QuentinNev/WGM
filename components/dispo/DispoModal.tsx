"use client"

import { useTransition, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createDispo } from "@/app/(app)/disponibilite/actions"
import { createGame } from "@/app/(app)/games/actions"
import { EmojiPicker } from "@/components/ui/EmojiPicker"

type Game = { id: string; name: string; emoji: string }
type Army = { id: string; gameId: string; name: string }

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
  const [isPending,     startTransition]     = useTransition()
  const [isGamePending, startGameTransition] = useTransition()
  const [selectedGameId, setSelectedGameId] = useState("")
  const [showNewGame,    setShowNewGame]     = useState(false)
  const [gameEmoji,      setGameEmoji]       = useState("⚔️")

  useEffect(() => {
    if (!isOpen) {
      setSelectedGameId("")
      setShowNewGame(false)
      setGameEmoji("⚔️")
    }
  }, [isOpen])

  const filteredArmies = armies.filter((a) => a.gameId === selectedGameId)

  if (!isOpen) return null

  const today = new Date().toISOString().split("T")[0]

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await createDispo(formData)
      router.refresh()
      onClose()
    })
  }

  function handleCreateGame(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startGameTransition(async () => {
      const newId = await createGame(formData)
      router.refresh()
      setSelectedGameId(newId)
      setShowNewGame(false)
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
          <button onClick={onClose} className="text-screen-muted hover:text-screen-glow transition-colors">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">

          <div>
            <label className={labelClass}>// Date</label>
            <input name="date" type="date" required defaultValue={today} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>// Début</label>
              <input name="timeStart" type="time" required defaultValue="18:00" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>// Fin</label>
              <input name="timeEnd" type="time" defaultValue="21:00" className={inputClass} />
            </div>
          </div>

          {/* Jeu + bouton nouveau jeu */}
          <div>
            <label className={labelClass}>// Jeu</label>
            <div className="flex gap-2">
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
              <button
                type="button"
                onClick={() => setShowNewGame((v) => !v)}
                className={`shrink-0 border px-3 py-2 text-sm transition-colors ${
                  showNewGame
                    ? "border-screen-glow text-screen-glow bg-screen-glow/10"
                    : "border-screen-border text-screen-muted hover:border-screen-glow hover:text-screen-glow"
                }`}
              >
                +
              </button>
            </div>

            {/* Mini-formulaire nouveau jeu */}
            {showNewGame && (
              <form
                onSubmit={handleCreateGame}
                className="mt-2 flex gap-2 border border-screen-border bg-screen-bg p-3"
              >
                <input type="hidden" name="gameEmoji" value={gameEmoji} />
                <EmojiPicker value={gameEmoji} onChange={setGameEmoji} />
                <input
                  name="gameName"
                  type="text"
                  placeholder="Nom du jeu"
                  required
                  className="min-w-0 flex-1 border border-screen-border bg-screen-surface px-3 py-1.5 text-sm text-screen-base placeholder:text-screen-muted focus:border-screen-glow focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={isGamePending}
                  className="shrink-0 border border-screen-glow px-3 py-1.5 text-xs text-screen-glow hover:bg-screen-glow/10 disabled:opacity-40 transition-colors"
                >
                  {isGamePending ? "..." : "OK"}
                </button>
              </form>
            )}
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
            <input name="format" type="text" placeholder="ex: 2000pts matched play" className={inputClass} />
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
