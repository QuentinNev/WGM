"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { availabilities } from "@/lib/db/schema";

/**
 * Creates a new availability entry in the database for the authenticated user.
 * @param formData The form data containing the availability details
 */
export async function createDispo(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Non autorisé");

  await db.insert(availabilities).values({
    userId: session.user.id,
    gameId: formData.get("gameId") as string,
    army: (formData.get("army") as string) || null,
    date: formData.get("date") as string,
    timeStart: formData.get("timeStart") as string,
    timeEnd: (formData.get("timeEnd") as string) || null,
    format: (formData.get("format") as string) || null,
    notes: (formData.get("notes") as string) || null,
  });

  revalidatePath("/");
}

/**
 * Updates an existing availability entry in the database for the authenticated user.
 * @param id The ID of the availability entry to update
 * @param formData The form data containing the updated availability details
 */
export async function updateDispo(id: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Non autorisé");

  await db
    .update(availabilities)
    .set({
      gameId: formData.get("gameId") as string,
      army: (formData.get("army") as string) || null,
      date: formData.get("date") as string,
      timeStart: formData.get("timeStart") as string,
      timeEnd: (formData.get("timeEnd") as string) || null,
      format: (formData.get("format") as string) || null,
      notes: (formData.get("notes") as string) || null,
    })
    .where(
      and(
        eq(availabilities.id, id),
        eq(availabilities.userId, session.user.id),
      ),
    );

  revalidatePath("/");
  revalidatePath("/profile");
}

/**
 * Deletes an existing availability entry in the database for the authenticated user.
 * @param id The ID of the availability entry to delete
 */
export async function deleteDispo(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Non autorisé");

  await db
    .delete(availabilities)
    .where(
      and(
        eq(availabilities.id, id),
        eq(availabilities.userId, session.user.id),
      ),
    );

  revalidatePath("/");
  revalidatePath("/profile");
}
