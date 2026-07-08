"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { availabilities } from "@/lib/db/schema"

export async function createDispo(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")

  await db.insert(availabilities).values({
    userId: session.user.id,
    gameId: formData.get("gameId") as string,
    armyId: (formData.get("armyId") as string) || null,
    date: formData.get("date") as string,
    timeStart: formData.get("timeStart") as string,
    timeEnd: (formData.get("timeEnd") as string) || null,
    format: (formData.get("format") as string) || null,
    notes: (formData.get("notes") as string) || null,
  })

  revalidatePath("/")
}
