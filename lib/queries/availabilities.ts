import { and, eq, gte, lte, ne, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { availabilities, games, profiles, availStatusEnum } from "@/lib/db/schema"

/**
 * Get availabilities for a specific month, optionally filtering by game ID and excluding the user's own availabilities.
 * @param param0 An object containing the parameters for the query.
 * @param param0.startDate The start date of the month.
 * @param param0.endDate The end date of the month.
 * @param param0.gameId Optional game ID to filter by.
 * @param param0.userId The ID of the current user.
 * @param param0.showOwn Whether to include the user's own availabilities.
 * @returns A promise that resolves to an array of availabilities for the specified month.
 */
export function getMonthAvailabilities({
  startDate,
  endDate,
  gameId,
  userId,
  showOwn,
}: {
  startDate: string
  endDate: string
  gameId?: string
  userId: string
  showOwn: boolean
}) {
  return db
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
        eq(availabilities.status, availStatusEnum.enumValues[0]) // Only include availabilities with status "pending"
      )
    )
    .groupBy(availabilities.date, games.emoji)
}

/**
 * Get availabilities for a specific day, optionally filtering out the user's own availabilities.
 * @param param0 
 * @param param0.day 
 * @param param0.userId 
 * @param param0.showOwn
 * @returns A promise that resolves to an array of availabilities for the specified day.
 */
export function getDayAvailabilities({
  day,
  userId,
  showOwn,
}: {
  day: string
  userId: string
  showOwn: boolean
}) {
  return db
    .select({
      id: availabilities.id,
      timeStart: availabilities.timeStart,
      timeEnd: availabilities.timeEnd,
      format: availabilities.format,
      notes: availabilities.notes,
      army: availabilities.army,
      gameEmoji: games.emoji,
      gameName: games.name,
      pseudo: profiles.pseudo,
      phone: profiles.phone,
      contactEmail: profiles.contactEmail,
    })
    .from(availabilities)
    .innerJoin(games, eq(availabilities.gameId, games.id))
    .leftJoin(profiles, eq(availabilities.userId, profiles.userId))
    .where(
      and(
        eq(availabilities.date, day),
        !showOwn ? ne(availabilities.userId, userId) : undefined,
        eq(availabilities.status, availStatusEnum.enumValues[0]) // Only include availabilities with status "pending"
      )
    )
    .orderBy(availabilities.timeStart)
}
