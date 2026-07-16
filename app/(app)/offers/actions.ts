"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { availabilities, games, offers, profiles, user } from "@/lib/db/schema";
import { resend, FROM_EMAIL } from "@/lib/resend";

export async function createOffer(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Non autorisé");

  const availabilityId = formData.get("availabilityId") as string;
  const army = (formData.get("army") as string) || null;
  const message = (formData.get("message") as string) || null;

  if (process.env.NODE_ENV === "production") {
    const [avail] = await db
      .select({ userId: availabilities.userId })
      .from(availabilities)
      .where(eq(availabilities.id, availabilityId));
    if (avail?.userId === session.user.id)
      throw new Error("Impossible d'envoyer une offre sur votre propre disponibilité");
  }

  await db.insert(offers).values({
    senderId: session.user.id,
    availabilityId,
    army,
    message,
  });

  const [[row], [senderProfile]] = await Promise.all([
    db
      .select({
        email: user.email,
        pseudo: profiles.pseudo,
        date: availabilities.date,
        gameEmoji: games.emoji,
        gameName: games.name,
      })
      .from(availabilities)
      .innerJoin(user, eq(availabilities.userId, user.id))
      .innerJoin(games, eq(availabilities.gameId, games.id))
      .leftJoin(profiles, eq(profiles.userId, availabilities.userId))
      .where(eq(availabilities.id, availabilityId)),
    db
      .select({ pseudo: profiles.pseudo, phone: profiles.phone, contactEmail: profiles.contactEmail })
      .from(profiles)
      .where(eq(profiles.userId, session.user.id)),
  ]);

  if (row) {
    const baseUrl = process.env.BETTER_AUTH_URL
      ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const contactLines = [
      senderProfile?.phone ? `Tél. : ${senderProfile.phone}` : null,
      senderProfile?.contactEmail ? `Email : ${senderProfile.contactEmail}` : null,
    ].filter(Boolean).join("\n");

    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: row.email,
      subject: `${senderProfile?.pseudo ?? session.user.name} est intéressé pour jouer à ${row.gameEmoji} ${row.gameName} le ${row.date}`,
      text: [
        `Salut ${row.pseudo ?? ""} !`,
        "",
        `${senderProfile?.pseudo ?? session.user.name} est dispo pour jouer le ${row.date} à ${row.gameEmoji} ${row.gameName}.`,
        army ? `Armée : ${army}` : null,
        message ? `Message : ${message}` : null,
        "",
        `Tu peux le joindre via :`,
        contactLines || "Aucun contact renseigné.",
        "",
        `N'oublie pas de te rendre sur ton profil pour accepter l'offre :`,
        `${baseUrl}/profiles`,
      ].filter((l) => l !== null).join("\n"),
    });

    console.log("Email sent:", res);
  }

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
