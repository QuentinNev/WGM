import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { profiles } from "@/lib/db/schema";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, session!.user.id),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Mon profil</h1>
      <ProfileForm profile={profile ?? null} />
    </div>
  )
}
