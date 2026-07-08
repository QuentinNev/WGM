import { and, eq, gte, lte, ne, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { availabilities, armies, games, profiles } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { CalendarGrid } from "@/components/calendar/CalendarGrid"

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

  const [allGames, allArmies, rows, dayDispos] = await Promise.all([
    db.select().from(games),
    db.select().from(armies),
    db
      .select({
        date: availabilities.date,
        emoji: games.emoji,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(availabilities)
      .innerJoin(games, eq(availabilities.gameId, games.id))
      .where(
        and(
          gte(availabilities.date, startDate),
          lte(availabilities.date, endDate),
          gameId ? eq(availabilities.gameId, gameId) : undefined,
          !showOwn ? ne(availabilities.userId, userId) : undefined,
        )
      )
      .groupBy(availabilities.date, games.emoji),
    selectedDay
      ? db
          .select({
            id: availabilities.id,
            timeStart: availabilities.timeStart,
            timeEnd: availabilities.timeEnd,
            format: availabilities.format,
            notes: availabilities.notes,
            gameEmoji: games.emoji,
            gameName: games.name,
            armyName: armies.name,
            pseudo: profiles.pseudo,
          })
          .from(availabilities)
          .innerJoin(games, eq(availabilities.gameId, games.id))
          .leftJoin(armies, eq(availabilities.armyId, armies.id))
          .leftJoin(profiles, eq(availabilities.userId, profiles.userId))
          .where(
            and(
              eq(availabilities.date, selectedDay),
              !showOwn ? ne(availabilities.userId, userId) : undefined,
            )
          )
          .orderBy(availabilities.timeStart)
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
      armies={allArmies}
      selectedGameId={gameId}
      selectedDay={selectedDay}
      dayDispos={dayDispos}
      showOwn={showOwn}
    />
  )
}
