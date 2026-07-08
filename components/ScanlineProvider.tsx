"use client"

import { useEffect } from "react"

export function ScanlineProvider() {
  useEffect(() => {
    const enabled = localStorage.getItem("scanlines") !== "false"
    document.body.classList.toggle("scanlines", enabled)
  }, [])

  return null
}
