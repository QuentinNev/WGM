"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"email" | "otp">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" })
    setLoading(false)
    if (error) { setError(error.message ?? "Erreur transmetteur."); return }
    setStep("otp")
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await authClient.signIn.emailOtp({ email, otp })
    setLoading(false)
    if (error) { setError(error.message ?? "Code invalide."); return }
    router.push("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-screen-bg p-4 screen-flicker">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="font-display text-6xl text-screen-glow glow-text tracking-widest mb-1">
            WGM.SYS
          </div>
          <div className="text-xs text-screen-muted tracking-widest uppercase">
            Wargame Matchmaker — v0.2.1
          </div>
        </div>

        {/* Panel */}
        <div className="border border-screen-border bg-screen-surface p-6 glow-box">

          {/* Status bar */}
          <div className="mb-6 border-b border-screen-border pb-3 text-xs text-screen-muted tracking-widest">
            <span className="text-screen-amber">▶</span>{" "}
            {step === "email"
              ? "IDENTIFICATION COGITATOR — ENTRER ADRESSE"
              : `TRANSMISSION OTP → ${email}`}
          </div>

          {step === "email" ? (
            <form onSubmit={sendOtp} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-screen-muted tracking-widest uppercase">
                  // Adresse email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="servant@imperium.terra"
                  required
                  className="w-full border border-screen-border bg-screen-bg px-4 py-2 text-screen-base placeholder:text-screen-muted focus:border-screen-glow focus:outline-none focus:ring-1 focus:ring-screen-glow/30 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full border border-screen-glow bg-transparent py-2 text-sm text-screen-glow tracking-widest uppercase hover:bg-screen-glow/10 disabled:opacity-40 transition-colors glow-text-sm"
              >
                {loading ? "Transmission..." : "▶ Envoyer code"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-screen-muted tracking-widest uppercase">
                  // Code OTP reçu
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="______"
                  maxLength={6}
                  required
                  className="w-full border border-screen-border bg-screen-bg px-4 py-2 text-center font-display text-3xl tracking-[0.5em] text-screen-glow placeholder:text-screen-muted focus:border-screen-glow focus:outline-none focus:ring-1 focus:ring-screen-glow/30 transition-colors glow-text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full border border-screen-glow bg-transparent py-2 text-sm text-screen-glow tracking-widest uppercase hover:bg-screen-glow/10 disabled:opacity-40 transition-colors glow-text-sm"
              >
                {loading ? "Vérification..." : "▶ Accéder au système"}
              </button>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-xs text-screen-muted hover:text-screen-base tracking-widest transition-colors"
              >
                ← Modifier l'adresse
              </button>
            </form>
          )}

          {error && (
            <div className="mt-4 border border-screen-red/40 bg-screen-red/5 px-4 py-2 text-xs text-screen-red tracking-wide">
              ⚠ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
