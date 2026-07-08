"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { deleteDispo } from "@/app/(app)/disponibilite/actions"

type Dispo = {
  id: string
  date: string
  timeStart: string
  timeEnd: string | null
  format: string | null
  notes: string | null
  gameEmoji: string
  gameName: string
  armyName: string | null
}

function DispoCard({ dispo }: { dispo: Dispo }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const isPast = dispo.date < new Date().toISOString().split("T")[0]

  const formattedDate = new Date(dispo.date + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  function handleDelete() {
    startTransition(async () => {
      await deleteDispo(dispo.id)
      router.refresh()
    })
  }

  return (
    <div className={`border bg-screen-bg p-4 transition-opacity ${isPast ? "border-screen-border opacity-50" : "border-screen-border"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <div className="text-sm text-screen-bright">
            {dispo.gameEmoji} {dispo.gameName}
            {dispo.armyName && <span className="text-screen-muted"> — {dispo.armyName}</span>}
          </div>
          <div className="text-xs text-screen-muted">
            {formattedDate} · {dispo.timeStart.slice(0, 5)}
            {dispo.timeEnd && <> → {dispo.timeEnd.slice(0, 5)}</>}
            {dispo.format && <> · {dispo.format}</>}
          </div>
          {dispo.notes && (
            <div className="text-xs text-screen-base opacity-80">{dispo.notes}</div>
          )}
        </div>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="shrink-0 border border-screen-red/40 px-3 py-1 text-xs text-screen-red hover:bg-screen-red/10 disabled:opacity-40 transition-colors"
        >
          {isPending ? "..." : "Supprimer"}
        </button>
      </div>
    </div>
  )
}

export function DispoList({ dispos }: { dispos: Dispo[] }) {
  if (dispos.length === 0) {
    return (
      <p className="text-sm text-screen-muted">Aucune disponibilité enregistrée.</p>
    )
  }

  const today = new Date().toISOString().split("T")[0]
  const upcoming = dispos.filter((d) => d.date >= today)
  const past     = dispos.filter((d) => d.date <  today)

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-screen-muted tracking-widest">// À venir</div>
          {upcoming.map((d) => <DispoCard key={d.id} dispo={d} />)}
        </div>
      )}
      {past.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-screen-muted tracking-widest">// Passées</div>
          {past.map((d) => <DispoCard key={d.id} dispo={d} />)}
        </div>
      )}
    </div>
  )
}
