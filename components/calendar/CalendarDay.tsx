type Props = {
  day: number
  isToday: boolean
  isSelected: boolean
  counts: { emoji: string; count: number }[]
  onClick: () => void
}

export function CalendarDay({ day, isToday, isSelected, counts, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`min-h-20 cursor-pointer p-2 transition-colors ${
        isSelected
          ? "bg-screen-glow/10 border border-screen-glow glow-box"
          : isToday
          ? "bg-screen-surface border border-screen-glow/50"
          : "bg-screen-surface hover:bg-screen-bg"
      }`}
    >
      <div
        className={`font-display text-2xl leading-none ${
          isSelected || isToday ? "text-screen-glow glow-text" : "text-screen-muted"
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
