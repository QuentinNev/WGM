"use client"

import { useRouter } from "next/navigation"
import { CalendarDay } from "./CalendarDay"

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
]

type GameCount = { emoji: string; count: number }

type Props = {
  year: number
  month: number
  byDate: Record<string, GameCount[]>
  games: { id: string; name: string; emoji: string }[]
  selectedGameId?: string
}

export function CalendarGrid({ year, month, byDate, games, selectedGameId }: Props) {
  const router = useRouter()

  const pad = (n: number) => String(n).padStart(2, "0")

  function buildUrl(y: number, m: number, gameId?: string) {
    const params = new URLSearchParams()
    params.set("month", `${y}-${pad(m)}`)
    if (gameId) params.set("game", gameId)
    return `/?${params}`
  }

  function goMonth(dir: -1 | 1) {
    let m = month + dir
    let y = year
    if (m > 12) { m = 1; y++ }
    if (m < 1)  { m = 12; y-- }
    router.push(buildUrl(y, m, selectedGameId))
  }

  // Grille lundi-premier
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay()
  const padding = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  const daysInMonth = new Date(year, month, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(padding).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const todayStr = new Date().toISOString().split("T")[0]

  return (
    <div className="space-y-6">

      {/* Header navigation */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-screen-bright glow-text tracking-widest">
          {MONTHS[month - 1]} {year}
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => goMonth(-1)}
            className="border border-screen-border px-3 py-1 text-screen-muted hover:border-screen-glow hover:text-screen-glow transition-colors"
          >
            ◀
          </button>
          <button
            onClick={() => goMonth(1)}
            className="border border-screen-border px-3 py-1 text-screen-muted hover:border-screen-glow hover:text-screen-glow transition-colors"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Filtre par jeu */}
      <select
        value={selectedGameId ?? ""}
        onChange={(e) => router.push(buildUrl(year, month, e.target.value || undefined))}
        className="border border-screen-border bg-screen-bg px-4 py-2 text-sm text-screen-base focus:border-screen-glow focus:outline-none transition-colors"
      >
        <option value="">// Tous les jeux</option>
        {games.map((g) => (
          <option key={g.id} value={g.id}>
            {g.emoji} {g.name}
          </option>
        ))}
      </select>

      {/* Grille */}
      <div>
        <div className="grid grid-cols-7 gap-px mb-1">
          {DAYS.map((d) => (
            <div key={d} className="py-1 text-center text-xs text-screen-muted tracking-widest uppercase">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-screen-border">
          {cells.map((day, i) => {
            if (!day) return <div key={i} className="bg-screen-bg min-h-20" />
            const dateStr = `${year}-${pad(month)}-${pad(day)}`
            return (
              <CalendarDay
                key={i}
                day={day}
                isToday={dateStr === todayStr}
                counts={byDate[dateStr] ?? []}
              />
            )
          })}
        </div>
      </div>

    </div>
  )
}
