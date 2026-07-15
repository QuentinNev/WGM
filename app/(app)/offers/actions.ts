"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
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
