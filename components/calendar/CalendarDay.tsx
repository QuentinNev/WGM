type Props = {
  day: number
  isToday: boolean
  counts: { emoji: string; count: number }[]
}

export function CalendarDay({ day, isToday, counts }: Props) {
  return (
    <div
      className={`bg-screen-surface min-h-20 p-2 cursor-pointer hover:bg-screen-bg transition-colors ${
        isToday ? "border border-screen-glow glow-box" : ""
      }`}
    >
      <div
        className={`font-display text-2xl leading-none ${
          isToday ? "text-screen-glow glow-text" : "text-screen-muted"
        }`}
      >
        {day}
      </div>

      {counts.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5">
          {counts.map((c, i) => (
            <span key={i} className="text-xs text-screen-base">
              {c.emoji} {c.count}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
