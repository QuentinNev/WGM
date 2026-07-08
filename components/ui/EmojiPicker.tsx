"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import data from "@emoji-mart/data"

type EmojiData = {
  emojis: Record<string, { id: string; name: string; native?: string; skins: { native: string }[] }>
}

const allEmojis = Object.values((data as EmojiData).emojis)

type Props = {
  value: string
  onChange: (emoji: string) => void
}

export function EmojiPicker({ value, onChange }: Props) {
  const [open,   setOpen]   = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef     = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  useEffect(() => {
    if (open) {
      setSearch("")
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const results = useMemo(() => {
    const q = search.toLowerCase()
    const list = q
      ? allEmojis.filter((e) => e.name.toLowerCase().includes(q))
      : allEmojis
    return list.slice(0, 80)
  }, [search])

  function select(native: string) {
    onChange(native)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-14 border py-1.5 text-center text-xl transition-colors ${
          open
            ? "border-screen-glow bg-screen-glow/10"
            : "border-screen-border bg-screen-surface hover:border-screen-glow"
        }`}
      >
        {value || "＋"}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 border border-screen-border bg-screen-surface glow-box">
          <div className="border-b border-screen-border p-2">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full border border-screen-border bg-screen-bg px-3 py-1.5 text-sm text-screen-base placeholder:text-screen-muted focus:border-screen-glow focus:outline-none transition-colors"
            />
          </div>
          <div className="grid grid-cols-8 gap-0.5 overflow-y-auto p-2" style={{ maxHeight: "240px" }}>
            {results.map((e) => {
              const native = e.skins[0].native
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => select(native)}
                  title={e.name}
                  className="flex items-center justify-center rounded p-1 text-xl hover:bg-screen-glow/10 transition-colors"
                >
                  {native}
                </button>
              )
            })}
            {results.length === 0 && (
              <p className="col-span-8 py-4 text-center text-xs text-screen-muted">
                Aucun résultat
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
