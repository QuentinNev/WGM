import { headers } from "next/headers";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { availabilities, armies, games, profiles } from "@/lib/db/schema";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { DispoList } from "@/components/profile/DispoList";
import { ScanlineToggle } from "@/components/options/ScanlineToggle";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const [profile, userDispos] = await Promise.all([
    db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    }),
    db
      .select({
        id: availabilities.id,
        date: availabilities.date,
        timeStart: availabilities.timeStart,
        timeEnd: availabilities.timeEnd,
        format: availabilities.format,
        notes: availabilities.notes,
        gameEmoji: games.emoji,
        gameName: games.name,
        armyName: armies.name,
      })
      .from(availabilities)
      .innerJoin(games, eq(availabilities.gameId, games.id))
      .leftJoin(armies, eq(availabilities.armyId, armies.id))
      .where(eq(availabilities.userId, userId))
      .orderBy(desc(availabilities.date), availabilities.timeStart),
  ]);

  return (
    <div className="space-y-10">
      <h1 className="font-display text-4xl text-screen-bright glow-text tracking-widest">
        // Profil
      </h1>

      <section className="space-y-4">
        <div className="border-b border-screen-border pb-2 text-xs tracking-widest text-screen-muted uppercase">
          ▶ Informations
        </div>
        <ProfileForm profile={profile ?? null} />
      </section>

      <section className="space-y-4">
        <div className="border-b border-screen-border pb-2 text-xs tracking-widest text-screen-muted uppercase">
          ▶ Mes disponibilités
        </div>
        <DispoList dispos={userDispos} />
      </section>

      <section className="space-y-4">
        <div className="border-b border-screen-border pb-2 text-xs tracking-widest text-screen-muted uppercase">
          ▶ Options affichage
        </div>
        <ScanlineToggle />
      </section>
    </div>
  );
}
