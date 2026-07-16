# 🎲 Where Gamers Meet

> A matchmaking platform for players — post your availability, find opponents.

---

## Overview

The idea came from a common problem among wargamers : Finding someone available for at least 4 hours. Using a group chat is the default way but messages can be missed.
WGM offers a place where people can post their availabilities or look for available players, then the platform lets them get in touch.
The goal is to keep it as simple as possible.

WGM initially meant "WarGame Matchmaker" but changed for "Where Gamers Meet" to widen its scope to any kind of game or activity.

**Typical use case:**

1. You're free Saturday afternoon for a WH40K game with your prefered army
2. You post your availability on WGM
3. Another player sends you an offer (their army + an optional message)
4. You receive an email notification with their contact details (phone / email)
5. You accept the offer from your profile page — the availability is marked as matched

---

## Features

### Authentication

- Passwordless login via **OTP sent by email**
- No tedious account registration

### User Profile

- Username
- Contact details (phone, email) — **only revealed when someone contacts you**

### Availability Calendar

- Monthly view with navigation between months
- Each day shows availabilities as emojis + count per game (e.g. ⚔️ 3 · 🃏 1)
- Filter by game, toggle to show/hide your own availabilities
- Only pending (not yet matched) availabilities are listed
- Click a day → detailed list of availabilities for that day

### Creating an Availability

- Date
- Time slot (start / end)
- Game — pick an existing one or create a new game on the fly (name + emoji picker)
- Format
- Army
- Free text field for details (skill level, location, points format...)

### Offers

- From a day's detail, send an **offer** on an availability (your army + an optional message)
- The availability's owner receives an **email notification** including your contact details
- Offers appear on the owner's profile page, under the matching availability
- Accepting an offer marks both the offer and the availability as `accepted`

### Profile Page

- Edit your pseudo and contact details
- List of your availabilities (upcoming / past), editable and deletable
- Review and accept the offers you received

---

## Tech Stack

### Frontend

| Tool                                           | Purpose                       |
| ---------------------------------------------- | ----------------------------- |
| [Next.js 16](https://nextjs.org/) (App Router) | React framework, routing, SSR |
| TypeScript                                     | End-to-end static typing      |
| Tailwind CSS                                   | Utility-first styling         |

### Authentication

| Tool                                               | Purpose                 |
| -------------------------------------------------- | ----------------------- |
| [Better Auth](https://better-auth.com/) (emailOTP) | Session, OTP email flow |
| [Resend](https://resend.com/)                      | OTP email delivery      |

### Backend

| Tool                                     | Purpose                          |
| ---------------------------------------- | -------------------------------- |
| Next.js Server Actions                   | Mutations (dispos, offers, ...)  |
| Next.js Route Handlers                   | Auth endpoints & profile check   |
| [Drizzle ORM](https://orm.drizzle.team/) | Type-safe SQL queries            |
| [Resend](https://resend.com/)            | Transactional emails (offers)    |

### Database

| Tool                                    | Purpose             |
| --------------------------------------- | ------------------- |
| [Neon](https://neon.tech/) (PostgreSQL) | Serverless database |

### Infrastructure & Deployment

| Tool                          | Purpose                               |
| ----------------------------- | ------------------------------------- |
| [Vercel](https://vercel.com/) | Hosting, automatic CI/CD              |
| Neon ↔ Vercel integration     | `DATABASE_URL` injected automatically |

---

## Architecture

```
wgm/
├── app/
│   ├── (auth)/
│   │   └── login/              # OTP login page
│   ├── (app)/
│   │   ├── layout.tsx          # Protected layout (session required)
│   │   ├── page.tsx            # Availability calendar (home page)
│   │   ├── disponibilities/    # Availability server actions
│   │   ├── games/              # Game creation server action
│   │   ├── offers/             # Offer server actions (create, accept)
│   │   └── profiles/           # Profile page + server actions
│   └── api/
│       ├── auth/               # Better Auth handlers
│       └── me/                 # Current user profile check
├── components/
│   ├── calendar/               # Monthly grid, day detail, offer modal
│   ├── dispo/                  # Availability modal & forms
│   ├── profile/                # Profile form, dispo list & received offers
│   ├── options/                # Display options (scanlines toggle)
│   └── ui/                     # Generic components (emoji picker)
├── lib/
│   ├── db/
│   │   ├── schema.ts           # Drizzle schema
│   │   └── index.ts            # DB client
│   ├── queries/                # Shared read queries (availabilities, profiles)
│   ├── auth.ts                 # Better Auth config
│   ├── auth-client.ts          # Better Auth client
│   ├── resend.ts               # Resend client (email delivery)
│   └── types.ts                # Shared TypeScript types
└── drizzle/
    └── migrations/             # SQL migrations
```

---

## Database Schema

```sql
-- Better Auth tables
user        (id, email, email_verified, ...)
session     (id, user_id, token, expires_at, ...)
account     (id, user_id, provider_id, ...)
verification (id, identifier, value, expires_at)

-- App tables
profiles (id, user_id, pseudo, phone, contact_email, created_at)
games    (id, name, emoji, slug)
profile_games (profile_id, game_id)
availabilities (
  id, user_id, game_id,
  army, date, time_start, time_end,
  format, notes, status, created_at    -- status: pending | accepted | declined
)
offers (
  id, sender_id, availability_id,
  army, message, status, created_at    -- status: pending | accepted | declined
)
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech/) account (serverless PostgreSQL)
- A [Resend](https://resend.com/) account (you'll need a verified domain to send mail to other adress than yours)

### Installation

```bash
git clone https://github.com/your-username/wgm
cd wgm
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
# Better Auth
BETTER_AUTH_SECRET=          # openssl rand -base64 32
BETTER_AUTH_URL=             # http://localhost:3000 (or your production URL)

# Resend (OTP delivery)
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@your-domain.com

# Database
DATABASE_URL=postgresql://...
DATABASE_URL_UNPOOLED=postgresql://...   # for drizzle-kit migrations

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database

```bash
npm run db:generate   # generate migrations from the schema
npm run db:migrate    # apply migrations
npm run db:studio     # browse the database (Drizzle Studio)
```

### Run in Development

```bash
npm run dev
```

---

## License

MIT
