"use client"

import { useState } from "react"

type DayDispo = {
  id: string
  timeStart: string
  timeEnd: string | null
  format: string | null
  notes: string | null
  army: string | null
  gameEmoji: string
  gameName: string
  pseudo: string | null
  phone: string | null
  contactEmail: string | null
}

type Props = {
  date: string
  dispos: DayDispo[]
}

function whatsappUrl(phone: string) {
  const digits = phone.replace(/[\s\-().]/g, "")
  const normalized = digits.startsWith("0") ? "+41" + digits.slice(1) : digits
  return `https://wa.me/${normalized.replace("+", "")}`
}

function ContactModal({ dispo, onClose }: { dispo: DayDispo; onClose: () => void }) {
  const hasContact = dispo.phone || dispo.contactEmail

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-screen-bg/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="mx-4 w-full max-w-sm border border-screen-border bg-screen-surface glow-box">
        <div className="flex items-center justify-between border-b border-screen-border px-6 py-4">
          <span className="font-display text-xl text-screen-bright glow-text-sm">
            {dispo.pseudo ?? "Joueur"}
          </span>
          <button onClick={onClose} className="text-screen-muted hover:text-screen-glow transition-colors">
            ✕
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="text-xs text-screen-muted">
            {dispo.gameEmoji} {dispo.gameName}
            {dispo.army && <span> — {dispo.army}</span>}
          </div>

          {!hasContact && (
            <p className="text-sm text-screen-muted">Aucun contact renseigné.</p>
          )}

          {dispo.phone && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-screen-base">{dispo.phone}</span>
                <a
                  href={`tel:${dispo.phone}`}
                  className="border border-screen-border px-2 py-0.5 text-xs text-screen-muted hover:border-screen-glow hover:text-screen-glow transition-colors"
                >
                  Appel
                </a>
                <a
                  href={whatsappUrl(dispo.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-screen-glow px-2 py-0.5 text-xs text-screen-glow hover:bg-screen-glow/10 transition-colors glow-text-sm"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          )}

          {dispo.contactEmail && (
            <div className="space-y-2">
              <div className="text-xs text-screen-muted tracking-widest uppercase">// Email</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-screen-base break-all">{dispo.contactEmail}</span>
                <a
                  href={`mailto:${dispo.contactEmail}`}
                  className="shrink-0 border border-screen-amber px-2 py-0.5 text-xs text-screen-amber hover:bg-screen-amber/10 transition-colors"
                >
                  Mail
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function DayDetail({ date, dispos }: Props) {
  const [contactDispo, setContactDispo] = useState<DayDispo | null>(null)

  const formatted = new Date(date + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <>
      <div className="border border-screen-border bg-screen-surface glow-box">
        <div className="border-b border-screen-border px-4 py-3 text-xs text-screen-muted tracking-widest uppercase">
          ▶ {formatted}
        </div>

        {dispos.length === 0 ? (
          <p className="p-4 text-sm text-screen-muted">Aucune disponibilité ce jour.</p>
        ) : (
          <div className="divide-y divide-screen-border">
            {dispos.map((d) => (
              <div key={d.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="font-display text-2xl text-screen-bright glow-text-sm">
                      {d.pseudo ?? "Joueur"}
                    </div>
                    <div className="text-sm text-screen-base">
                      {d.gameEmoji} {d.gameName}
                      {d.army && <span className="text-screen-muted"> — {d.army}</span>}
                    </div>
                    {d.format && (
                      <div className="text-xs text-screen-muted">{d.format}</div>
                    )}
                  </div>
                  <div className="shrink-0 text-right text-xs text-screen-muted tabular-nums">
                    {d.timeStart.slice(0, 5)}
                    {d.timeEnd && <> → {d.timeEnd.slice(0, 5)}</>}
                  </div>
                </div>

                {d.notes && (
                  <p className="mt-2 text-xs text-screen-base opacity-80">{d.notes}</p>
                )}

                <button
                  onClick={() => setContactDispo(d)}
                  className="mt-3 border border-screen-amber px-3 py-1 text-xs text-screen-amber hover:bg-screen-amber/10 transition-colors"
                >
                  ▶ Contact
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {contactDispo && (
        <ContactModal dispo={contactDispo} onClose={() => setContactDispo(null)} />
      )}
    </>
  )
}
