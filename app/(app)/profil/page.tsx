import { ScanlineToggle } from "@/components/options/ScanlineToggle"

export default function ProfilPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl text-screen-bright glow-text tracking-widest">
        // Profil
      </h1>

      <section className="space-y-4">
        <div className="text-xs text-screen-muted tracking-widest uppercase border-b border-screen-border pb-2">
          ▶ Informations
        </div>
        <p className="text-sm text-screen-muted">Formulaire de profil à implémenter.</p>
      </section>

      <section className="space-y-4">
        <div className="text-xs text-screen-muted tracking-widest uppercase border-b border-screen-border pb-2">
          ▶ Options affichage
        </div>
        <ScanlineToggle />
      </section>
    </div>
  )
}
