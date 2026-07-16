import { headers } from "next/headers"
import { db } from "@/lib/db"
import { games } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { CalendarGrid } from "@/components/calendar/CalendarGrid"
import { getMonthAvailabilities, getDayAvailabilities } from "@/lib/queries/availabilities"

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; game?: string; day?: string; own?: string }>
}) {
  const { month: monthParam, game: gameId, day: selectedDay, own } = await searchParams

  const showOwn = own === "1"

  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session!.user.id

  const now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth() + 1

  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    ;[year, month] = monthParam.split("-").map(Number)
  }

  const pad = (n: number) => String(n).padStart(2, "0")
  const startDate = `${year}-${pad(month)}-01`
  const endDate = `${year}-${pad(month)}-${new Date(year, month, 0).getDate()}`

  const [allGames, rows, dayDispos] = await Promise.all([
    db.select().from(games),
    getMonthAvailabilities({ startDate, endDate, gameId, userId, showOwn }),
    selectedDay
      ? getDayAvailabilities({ day: selectedDay, userId, showOwn })
      : Promise.resolve([]),
  ])

  const byDate = rows.reduce<Record<string, { emoji: string; count: number }[]>>(
    (acc, row) => {
      if (!acc[row.date]) acc[row.date] = []
      acc[row.date].push({ emoji: row.emoji, count: row.count })
      return acc
    },
    {}
  )

  return (
    <CalendarGrid
      year={year}
      month={month}
      byDate={byDate}
      games={allGames}
      selectedGameId={gameId}
      selectedDay={selectedDay}
      dayDispos={dayDispos}
      showOwn={showOwn}
    />
  )
}
