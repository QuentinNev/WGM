import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="font-bold">Wargame Matchmaker</span>
          <div className="flex items-center gap-4 text-sm">
            <a href="/" className="hover:underline">
              Calendrier
            </a>
            <a href="/disponibilite/new" className="hover:underline">
              + Dispo
            </a>
            <a href="/profil" className="hover:underline">
              Profil
            </a>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  )
}
