type DayDispo = {
  id: string
  timeStart: string
  timeEnd: string | null
  format: string | null
  notes: string | null
  gameEmoji: string
  gameName: string
  armyName: string | null
  pseudo: string | null
}

type Props = {
  date: string
  dispos: DayDispo[]
}

export function DayDetail({ date, dispos }: Props) {
  const formatted = new Date(date + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="border border-screen-border bg-screen-surface glow-box">
      <div className="border-b border-screen-border px-4 py-3 text-xs text-screen-muted tracking-widest uppercase">
        ▶ {formatted}
      </div>

      {dispos.length === 0 ? (
        <p className="p-4 text-sm text-screen-muted">Aucune disponibilité ce jour.</p>
      ) : (
        <div className="divide-y divide-screen-border">
          {dispos.map((d) => (
            <div key={d.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="font-display text-2xl text-screen-bright glow-text-sm">
                    {d.pseudo ?? "Joueur"}
                  </div>
                  <div className="text-sm text-screen-base">
                    {d.gameEmoji} {d.gameName}
                    {d.armyName && (
                      <span className="text-screen-muted"> — {d.armyName}</span>
                    )}
                  </div>
                  {d.format && (
                    <div className="text-xs text-screen-muted">{d.format}</div>
                  )}
                </div>
                <div className="shrink-0 text-right text-xs text-screen-muted tabular-nums">
                  {d.timeStart.slice(0, 5)}
                  {d.timeEnd && <> → {d.timeEnd.slice(0, 5)}</>}
                </div>
              </div>

              {d.notes && (
                <p className="mt-2 text-xs text-screen-base opacity-80">{d.notes}</p>
              )}

              <button className="mt-3 border border-screen-amber px-3 py-1 text-xs text-screen-amber hover:bg-screen-amber/10 transition-colors">
                ▶ Contact
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
