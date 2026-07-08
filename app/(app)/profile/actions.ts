"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";

export async function saveProfile(_prevState: null, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("User not authenticated");

  const values = {
    pseudo: formData.get("pseudo") as string,
    contactEmail: formData.get("contactEmail") as string,
    phone: formData.get("phone") as string,
  };

  await db
    .insert(profiles)
    .values({
      userId: session.user.id,
      ...values,
    })
    .onConflictDoUpdate({ target: profiles.userId, set: values });

  revalidatePath("/profile");
  return null;
}
