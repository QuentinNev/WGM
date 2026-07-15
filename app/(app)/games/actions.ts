"use server";

import { db } from "@/lib/db";
import { games } from "@/lib/db/schema";

/**
 * Creates a new game entry in the database.
 * @param formData The form data containing the game details
 * @returns The ID of the newly created game
 */
export async function createGame(formData: FormData): Promise<string> {
  const name = formData.get("gameName") as string;
  const emoji = formData.get("gameEmoji") as string;
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const [game] = await db
    .insert(games)
    .values({ name, emoji, slug })
    .returning({ id: games.id });
  return game.id;
}
