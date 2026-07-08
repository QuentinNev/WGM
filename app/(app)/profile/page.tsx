import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { profiles } from "@/lib/db/schema";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ScanlineToggle } from "@/components/options/ScanlineToggle";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, session!.user.id),
  });

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
          ▶ Options affichage
        </div>
        <ScanlineToggle />
      </section>
    </div>
  );
}
