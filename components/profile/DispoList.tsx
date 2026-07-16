"use client"

import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { deleteDispo, updateDispo } from "@/app/(app)/disponibilities/actions"
import type { Dispo, Game, Offer } from "@/lib/types"

const inputClass =
  "w-full border border-screen-border bg-screen-surface px-3 py-1.5 text-sm text-screen-base placeholder:text-screen-muted focus:border-screen-glow focus:outline-none transition-colors"

const labelClass = "block text-xs text-screen-muted tracking-widest uppercase mb-1"

function DispoCard({ dispo, games }: { dispo: Dispo; games: Game[] }) {
  const router = useRouter()
  const [isDeleting, startDelete] = useTransition()
  const [isSaving, startSave] = useTransition()
  const [editing, setEditing] = useState(false)

  const isPast = dispo.date < new Date().toISOString().split("T")[0]

  const formattedDate = new Date(dispo.date + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  })

  function handleDelete() {
    startDelete(async () => {
      await deleteDispo(dispo.id)
      router.refresh()
    })
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startSave(async () => {
      await updateDispo(dispo.id, formData)
      router.refresh()
      setEditing(false)
    })
  }

  return (
    <div className={`border border-screen-border bg-screen-bg transition-opacity ${isPast ? "opacity-50" : ""}`}>
      <div className="flex items-start justify-between gap-4 p-4">
        <div className="space-y-0.5">
          <div className="text-sm text-screen-bright">
            {dispo.gameEmoji} {dispo.gameName}
            {dispo.army && <span className="text-screen-muted"> — {dispo.army}</span>}
          </div>
          <div className="text-xs text-screen-muted">
            {formattedDate} · {dispo.timeStart.slice(0, 5)}
            {dispo.timeEnd && <> → {dispo.timeEnd.slice(0, 5)}</>}
            {dispo.format && <> · {dispo.format}</>}
          </div>
          {dispo.notes && !editing && (
            <div className="text-xs text-screen-base opacity-80">{dispo.notes}</div>
          )}
          {dispo.offers && (
            <div className="text-xs text-screen-muted opacity-80">
              {dispo.offers.map((o) => <OfferCard key={o.id} offer={o} />)}
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => setEditing((v) => !v)}
            className={`border px-3 py-1 text-xs transition-colors ${editing
              ? "border-screen-glow text-screen-glow bg-screen-glow/10"
              : "border-screen-border text-screen-muted hover:border-screen-glow hover:text-screen-glow"
              }`}
          >
            Éditer
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="border border-screen-red/40 px-3 py-1 text-xs text-screen-red hover:bg-screen-red/10 disabled:opacity-40 transition-colors"
          >
            {isDeleting ? "..." : "Supprimer"}
          </button>
        </div>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="border-t border-screen-border p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>// Date</label>
              <input
                name="date" type="date" required
                defaultValue={dispo.date}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div>
                <label className={labelClass}>// Début</label>
                <input
                  name="timeStart" type="time" required
                  defaultValue={dispo.timeStart.slice(0, 5)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>// Fin</label>
                <input
                  name="timeEnd" type="time"
                  defaultValue={dispo.timeEnd?.slice(0, 5) ?? ""}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>// Jeu</label>
            <select name="gameId" required defaultValue={dispo.gameId} className={inputClass}>
              {games.map((g) => (
                <option key={g.id} value={g.id}>{g.emoji} {g.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>// Armée</label>
            <input
              name="army" type="text"
              defaultValue={dispo.army ?? ""}
              placeholder="ex: Space Marines, Stormcast..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>// Format</label>
            <input
              name="format" type="text"
              defaultValue={dispo.format ?? ""}
              placeholder="ex: 2000pts matched play"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>// Notes</label>
            <textarea
              name="notes" rows={2}
              defaultValue={dispo.notes ?? ""}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="border border-screen-glow px-4 py-1.5 text-xs text-screen-glow hover:bg-screen-glow/10 disabled:opacity-40 transition-colors glow-text-sm"
            >
              {isSaving ? "Enregistrement..." : "▶ Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="border border-screen-border px-4 py-1.5 text-xs text-screen-muted hover:border-screen-muted transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

function OfferCard({ offer }: { offer: Offer; }) {
  return (<div>
    {offer.sender?.pseudo}
    {offer.army}
    {offer.message}
  </div>);
}

export function DispoList({ dispos, games }: { dispos: Dispo[]; games: Game[] }) {
  if (dispos.length === 0) {
    return <p className="text-sm text-screen-muted">Aucune disponibilité enregistrée.</p>
  }

  const today = new Date().toISOString().split("T")[0]
  const upcoming = dispos.filter((d) => d.date >= today)
  const past = dispos.filter((d) => d.date < today)

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-screen-muted tracking-widest">// À venir</div>
          {upcoming.map((d) => <DispoCard key={d.id} dispo={d} games={games} />)}
        </div>
      )}
      {past.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-screen-muted tracking-widest">// Passées</div>
          {past.map((d) => <DispoCard key={d.id} dispo={d} games={games} />)}
        </div>
      )}
    </div>
  )
}
