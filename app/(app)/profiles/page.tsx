import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { games } from "@/lib/db/schema";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { DispoList } from "@/components/profile/DispoList";
import { ScanlineToggle } from "@/components/options/ScanlineToggle";
import { LogoutButton } from "@/components/profile/LogoutButton";
import { getUserProfile, getUserDispos } from "@/lib/queries/profiles";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const [profile, userDispos, allGames] = await Promise.all([
    getUserProfile(userId),
    getUserDispos(userId),
    db.select().from(games),
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
        <DispoList dispos={userDispos} games={allGames} />
      </section>

      <section className="space-y-4">
        <div className="border-b border-screen-border pb-2 text-xs tracking-widest text-screen-muted uppercase">
          ▶ Options affichage
        </div>
        <ScanlineToggle />
      </section>

      <section className="space-y-4">
        <div className="border-b border-screen-border pb-2 text-xs tracking-widest text-screen-muted uppercase">
          ▶ Session
        </div>
        <LogoutButton />
      </section>
    </div>
  );
}
