export type Game = {
  id: string
  name: string
  emoji: string
}

export type GameCount = {
  emoji: string
  count: number
}

export type Dispo = {
  id: string
  date: string
  timeStart: string
  timeEnd: string | null
  format: string | null
  notes: string | null
  gameId: string
  army: string | null
  gameEmoji: string
  gameName: string
}

export type DayDispo = {
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
