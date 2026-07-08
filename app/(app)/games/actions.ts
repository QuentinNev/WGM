"use server"

import { db } from "@/lib/db"
import { games } from "@/lib/db/schema"

export async function createGame(formData: FormData): Promise<string> {
  const name = formData.get("gameName") as string
  const emoji = formData.get("gameEmoji") as string
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

  const [game] = await db.insert(games).values({ name, emoji, slug }).returning({ id: games.id })
  return game.id
}
