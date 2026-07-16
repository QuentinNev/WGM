import { desc, eq, sql } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"
import { db } from "@/lib/db"
import { availabilities, games, offers, profiles } from "@/lib/db/schema"

const offerProfiles = alias(profiles, "offer_profiles")

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
      offers: sql<{ id: string; army: string | null; message: string | null; sender: { pseudo: string; phone: string | null; contactEmail: string | null } | null }[]>`
        coalesce(
          json_agg(json_build_object(
            'id', ${offers.id},
            'army', ${offers.army},
            'message', ${offers.message},
            'sender', case when ${offerProfiles.pseudo} is not null then json_build_object(
              'pseudo', ${offerProfiles.pseudo},
              'phone', ${offerProfiles.phone},
              'contactEmail', ${offerProfiles.contactEmail}
            ) else null end
          )) filter (where ${offers.id} is not null),
          '[]'
        )
      `,
    })
    .from(availabilities)
    .innerJoin(games, eq(availabilities.gameId, games.id))
    .leftJoin(offers, eq(offers.availabilityId, availabilities.id))
    .leftJoin(offerProfiles, eq(offerProfiles.userId, offers.senderId))
    .where(eq(availabilities.userId, userId))
    .groupBy(availabilities.id, games.emoji, games.name)
    .orderBy(desc(availabilities.date), availabilities.timeStart)
}
