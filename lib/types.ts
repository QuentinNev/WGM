export type Game = {
  id: string;
  name: string;
  emoji: string;
};

export type GameCount = {
  emoji: string;
  count: number;
};

export type Dispo = {
  id: string;
  date: string;
  timeStart: string;
  timeEnd: string | null;
  format: string | null;
  notes: string | null;
  gameId: string;
  army: string | null;
  gameEmoji: string;
  gameName: string;
  offers: Offer[] | null;
};

export type OfferSender = {
  pseudo: string;
  phone: string | null;
  contactEmail: string | null;
};

export type Offer = {
  id: string;
  dispo?: Dispo;
  army: string | null;
  message: string | null;
  status: "pending" | "accepted" | "declined";
  sender: OfferSender | null;
};

export type DayDispo = {
  id: string;
  userId: string;
  timeStart: string;
  timeEnd: string | null;
  format: string | null;
  notes: string | null;
  army: string | null;
  gameEmoji: string;
  gameName: string;
  pseudo: string | null;
  phone: string | null;
  contactEmail: string | null;
};
