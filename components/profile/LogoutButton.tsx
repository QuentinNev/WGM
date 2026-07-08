"use client"

import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await signOut()
    router.push("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-400 hover:text-red-300 border border-red-400/40 hover:border-red-300/60 px-4 py-2 tracking-widest transition-colors"
    >
      ▶ Déconnexion
    </button>
  )
}
