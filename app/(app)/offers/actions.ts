"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { availabilities, offers } from "@/lib/db/schema";

export async function createOffer(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Non autorisé");

  await db.insert(offers).values({
    senderId: session.user.id,
    availabilityId: formData.get("availabilityId") as string,
    army: (formData.get("army") as string) || null,
    message: (formData.get("message") as string) || null,
  });

  revalidatePath("/");
}

export async function acceptOffer(offerId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Non autorisé");

  const [row] = await db
    .select({ availabilityId: offers.availabilityId, availabilityUserId: availabilities.userId })
    .from(offers)
    .innerJoin(availabilities, eq(offers.availabilityId, availabilities.id))
    .where(eq(offers.id, offerId));

  if (!row) throw new Error("Offre introuvable");
  if (row.availabilityUserId !== session.user.id) throw new Error("Non autorisé");

  await Promise.all([
    db.update(offers).set({ status: "accepted" }).where(eq(offers.id, offerId)),
    db.update(availabilities).set({ status: "accepted" }).where(eq(availabilities.id, row.availabilityId)),
  ]);

  revalidatePath("/profiles");
}
