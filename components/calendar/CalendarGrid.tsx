"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarDay } from "./CalendarDay"
import { DayDetail } from "./DayDetail"
import { DispoModal } from "@/components/dispo/DispoModal"

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
]

type GameCount = { emoji: string; count: number }
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
  year: number
  month: number
  byDate: Record<string, GameCount[]>
  games: { id: string; name: string; emoji: string }[]
  armies: { id: string; gameId: string; name: string }[]
  selectedGameId?: string
  selectedDay?: string
  dayDispos: DayDispo[]
  showOwn: boolean
}

export function CalendarGrid({
  year, month, byDate, games, armies,
  selectedGameId, selectedDay, dayDispos, showOwn,
}: Props) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)

  const pad = (n: number) => String(n).padStart(2, "0")

  function buildUrl(y: number, m: number, opts: { gameId?: string; day?: string; own?: boolean } = {}) {
    const params = new URLSearchParams()
    params.set("month", `${y}-${pad(m)}`)
    if (opts.gameId)  params.set("game", opts.gameId)
    if (opts.day)     params.set("day", opts.day)
    if (opts.own)     params.set("own", "1")
    return `/?${params}`
  }

  function goMonth(dir: -1 | 1) {
    let m = month + dir
    let y = year
    if (m > 12) { m = 1; y++ }
    if (m < 1)  { m = 12; y-- }
    router.push(buildUrl(y, m, { gameId: selectedGameId, own: showOwn }))
  }

  function selectDay(dateStr: string) {
    if (selectedDay === dateStr) {
      router.push(buildUrl(year, month, { gameId: selectedGameId, own: showOwn }))
    } else {
      router.push(buildUrl(year, month, { gameId: selectedGameId, day: dateStr, own: showOwn }))
    }
  }

  function toggleOwn() {
    router.push(buildUrl(year, month, { gameId: selectedGameId, day: selectedDay, own: !showOwn }))
  }

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
    <>
      <div className="space-y-6">

        {/* Header */}
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

        {/* Actions + filtres */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="border border-screen-glow px-4 py-2 text-sm text-screen-glow tracking-widest uppercase hover:bg-screen-glow/10 transition-colors glow-text-sm"
          >
            + Dispo
          </button>
          <select
            value={selectedGameId ?? ""}
            onChange={(e) => router.push(buildUrl(year, month, { gameId: e.target.value || undefined, day: selectedDay, own: showOwn }))}
            className="border border-screen-border bg-screen-bg px-4 py-2 text-sm text-screen-base focus:border-screen-glow focus:outline-none transition-colors"
          >
            <option value="">// Tous les jeux</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>{g.emoji} {g.name}</option>
            ))}
          </select>
          <button
            onClick={toggleOwn}
            className={`border px-4 py-2 text-sm tracking-widest uppercase transition-colors ${
              showOwn
                ? "border-screen-glow text-screen-glow bg-screen-glow/10 glow-text-sm"
                : "border-screen-border text-screen-muted hover:border-screen-muted"
            }`}
          >
            Mes dispos
          </button>
        </div>

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
                  isSelected={dateStr === selectedDay}
                  counts={byDate[dateStr] ?? []}
                  onClick={() => selectDay(dateStr)}
                />
              )
            })}
          </div>
        </div>

        {/* Détail du jour sélectionné */}
        {selectedDay && (
          <DayDetail date={selectedDay} dispos={dayDispos} />
        )}

      </div>

      <DispoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        games={games}
        armies={armies}
      />
    </>
  )
}
