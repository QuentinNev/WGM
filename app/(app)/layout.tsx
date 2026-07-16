import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen screen-flicker">
      <nav className="border-b border-screen-border bg-screen-surface glow-box">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <span className="font-display text-2xl text-screen-glow glow-text tracking-widest">
            ⚙ WGM.SYS
          </span>
          <div className="flex items-center gap-6 text-xs text-screen-muted uppercase tracking-widest">
            <a href="/" className="hover:text-screen-glow hover:glow-text-sm transition-colors">
              // Calendrier
            </a>
            <a href="/profiles" className="hover:text-screen-glow hover:glow-text-sm transition-colors">
              // Profil
            </a>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-4 text-xs text-screen-muted tracking-widest">
          <span className="text-screen-amber">▶</span> PICT-FEED ACTIF — {session.user.email}
        </div>
        {children}
      </div>
    </div>
  )
}
