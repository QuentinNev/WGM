import { desc, eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { availabilities, games, offers, profiles } from "@/lib/db/schema"

export function getUserProfile(userId: string) {
  return db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  })
}

export function getUserDispos(userId: string) {
  return db
    .select({
      id: availabilities.id,
      date: availabilities.date,
      timeStart: availabilities.timeStart,
      timeEnd: availabilities.timeEnd,
      format: availabilities.format,
      notes: availabilities.notes,
      gameId: availabilities.gameId,
      army: availabilities.army,
      gameEmoji: games.emoji,
      gameName: games.name,
      offers: sql<{ id: string; army: string | null; message: string | null }[]>`
        coalesce(
          json_agg(json_build_object('id', ${offers.id}, 'army', ${offers.army}, 'message', ${offers.message}))
            filter (where ${offers.id} is not null),
          '[]'
        )
      `,
    })
    .from(availabilities)
    .innerJoin(games, eq(availabilities.gameId, games.id))
    .leftJoin(offers, eq(offers.availabilityId, availabilities.id))
    .where(eq(availabilities.userId, userId))
    .groupBy(availabilities.id, games.emoji, games.name)
    .orderBy(desc(availabilities.date), availabilities.timeStart)
}
