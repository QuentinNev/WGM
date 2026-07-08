# 🎲 Wargame Matchmaker

> A matchmaking platform for wargame players — post your availability, find opponents.

---

## Overview

Wargame Matchmaker lets wargame enthusiasts (Warhammer 40K, Age of Sigmar...) publish their availability slots and easily find opponents for a game.

**Typical use case:**

1. You're free Saturday afternoon for a WH40K game with your Sisters of Battle
2. You post your availability on Wargame Matchmaker
3. Another player contacts you via your contact information

---

## Features

### Authentication

- Passwordless login via **OTP sent by email**
- No tedious account registration

### User Profile

- Username
- Contact details (phone, email) — **only revealed when someone contacts you**

### Availability Calendar

- Monthly view of the current month
- Each day shows availabilities as emojis + count per game (e.g. ⚔️ 3 · 🃏 1)
- Filter by game
- Click a day → detailed list of availabilities for that day

### Creating an Availability

- Date
- Time slot (start / end)
- Game
- Format
- Army
- Free text field for details (skill level, location, points format...)

### Viewing & Contacting

- Click an availability → detailed view
- **Contact** button → reveals the player's contact details (email or phone)

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

| Tool                                     | Purpose               |
| ---------------------------------------- | --------------------- |
| Next.js Route Handlers                   | Internal REST API     |
| [Drizzle ORM](https://orm.drizzle.team/) | Type-safe SQL queries |

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
│   │   └── disponibilite/      # Availability actions
│   └── api/
│       ├── auth/               # Better Auth handlers
│       └── me/                 # Current user profile check
├── components/
│   ├── calendar/               # Monthly grid + emojis + day detail
│   ├── dispo/                  # Availability modal & forms
│   ├── profile/                # Profile form & dispo list
│   ├── options/                # Display options (scanlines toggle)
│   └── ui/                     # Generic components (emoji picker)
├── lib/
│   ├── db/
│   │   ├── schema.ts           # Drizzle schema
│   │   └── index.ts            # DB client
│   ├── auth.ts                 # Better Auth config
│   └── auth-client.ts          # Better Auth client
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
  format, notes, created_at
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
npm run db:generate
npm run db:migrate
```

### Run in Development

```bash
npm run dev
```

---

## License

MIT
