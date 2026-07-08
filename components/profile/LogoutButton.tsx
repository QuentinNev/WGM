"use client"

import { signOut } from "@/lib/auth-client"

export function LogoutButton() {
  async function handleLogout() {
    await signOut()
    window.location.href = "/login"
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
