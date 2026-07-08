"use client"

import { useEffect, useState } from "react"

export function ScanlineToggle() {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    setEnabled(localStorage.getItem("scanlines") !== "false")
  }, [])

  function toggle() {
    const next = !enabled
    setEnabled(next)
    localStorage.setItem("scanlines", next ? "true" : "false")
    document.body.classList.toggle("scanlines", next)
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-3 text-sm text-screen-base hover:text-screen-glow transition-colors"
    >
      <span
        className={`relative inline-block h-4 w-8 border transition-colors ${
          enabled ? "border-screen-glow bg-screen-glow/20" : "border-screen-muted bg-transparent"
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 transition-all ${
            enabled ? "left-4 bg-screen-glow" : "left-0.5 bg-screen-muted"
          }`}
        />
      </span>
      Scanlines {enabled ? "ON" : "OFF"}
    </button>
  )
}
