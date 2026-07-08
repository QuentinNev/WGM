# 🎲 Wargame Matchmaker

> Plateforme de mise en relation pour joueurs de wargame — affichez vos disponibilités, trouvez des adversaires.

---

## Présentation

Wargame Matchmaker permet aux passionnés de wargame (Warhammer 40K, Age of Sigmar, Kings of War...) de publier leurs créneaux de disponibilité et de trouver facilement des adversaires pour une partie. Fini les posts dans des groupes Facebook qui se perdent : une interface calendrier claire, filtrée par jeu.

**Cas d'usage typique :**

1. Tu es dispo samedi après-midi pour une partie de WH40K avec tes Sœurs de Bataille
2. Tu publies ta dispo sur Wargame Matchmaker
3. Un autre joueur te contacte directement via l'app

---

## Fonctionnalités

### Authentification

- Connexion sans mot de passe par **OTP envoyé par email** (magic link)
- Pas de création de compte fastidieuse

### Profil utilisateur

- Pseudo
- Jeux pratiqués
- Armées par jeu
- Coordonnées de contact (téléphone, email) — **visibles uniquement lors d'une prise de contact**

### Calendrier des disponibilités

- Vue mensuelle du mois en cours
- Chaque jour affiche les dispos sous forme d'émojis + compteur par jeu (ex: ⚔️ 3 · 🃏 1)
- Filtre par jeu
- Sélection d'un jour → liste détaillée des dispos du jour

### Création d'une disponibilité

- Date
- Créneau horaire (début / fin)
- Jeu
- Format (format libre ou liste prédéfinie par jeu)
- Armée
- Champ texte libre pour les détails (niveau, lieu, format points...)

### Consultation & contact

- Clic sur une dispo → vue détaillée
- Bouton **Contact** → révèle les coordonnées du joueur (email ou téléphone)

---

## Stack technique

### Frontend

| Outil                                          | Usage                         |
| ---------------------------------------------- | ----------------------------- |
| [Next.js 16](https://nextjs.org/) (App Router) | Framework React, routing, SSR |
| TypeScript                                     | Typage statique end-to-end    |
| Tailwind CSS                                   | Styles utilitaires            |

### Authentification

| Outil                                        | Usage                   |
| -------------------------------------------- | ----------------------- |
| [Auth.js v5](https://authjs.dev/) (NextAuth) | Session, OTP email flow |
| [Resend](https://resend.com/)                | Envoi des emails OTP    |

### Backend

| Outil                                    | Usage               |
| ---------------------------------------- | ------------------- |
| Next.js Route Handlers                   | API REST interne    |
| [Drizzle ORM](https://orm.drizzle.team/) | Requêtes SQL typées |

### Base de données

| Outil                             | Usage                                 |
| --------------------------------- | ------------------------------------- |
| PostgreSQL                        | Base de données principale            |
| [Supabase](https://supabase.com/) | Managed Postgres + Row Level Security |

### Infra & déploiement

| Outil                         | Usage                      |
| ----------------------------- | -------------------------- |
| [Vercel](https://vercel.com/) | Hosting, CI/CD automatique |
| GitHub Actions                | Lint, tests, checks PR     |

---

## Architecture

```
Wargame Matchmaker/
├── app/
│   ├── (auth)/
│   │   └── login/              # Page de connexion OTP
│   ├── (app)/
│   │   ├── layout.tsx          # Layout protégé (session requise)
│   │   ├── page.tsx            # Calendrier des dispos (page d'accueil)
│   │   ├── disponibilite/
│   │   │   └── new/            # Formulaire de création
│   │   └── profil/             # Gestion du profil
│   └── api/
│       ├── auth/               # Auth.js handlers
│       ├── disponibilites/     # CRUD disponibilités
│       └── profil/             # CRUD profil
├── components/
│   ├── calendar/               # Grille mensuelle + émojis
│   ├── dispo/                  # Cards et formulaires de dispo
│   └── ui/                     # Composants génériques
├── lib/
│   ├── db/
│   │   ├── schema.ts           # Schéma Drizzle
│   │   └── index.ts            # Client DB
│   └── auth.ts                 # Config Auth.js
└── drizzle/
    └── migrations/             # Migrations SQL
```

---

## Schéma de base de données

```sql
-- Utilisateurs
users (id, email, created_at)

-- Profils
profiles (id, user_id, pseudo, phone, contact_email, created_at)

-- Jeux disponibles
games (id, name, emoji, slug)

-- Armées par jeu
armies (id, game_id, name)

-- Liens profil ↔ jeux pratiqués
profile_games (profile_id, game_id)

-- Liens profil ↔ armées
profile_armies (profile_id, army_id)

-- Disponibilités
availabilities (
  id, user_id, game_id, army_id,
  date, time_start, time_end,
  format, notes,
  created_at
)
```

> Les champs `phone` et `contact_email` de `profiles` sont couverts par la **Row Level Security** de Supabase : ils ne sont exposés que lors d'un appel authentifié explicite (bouton Contact).

---

## Démarrage rapide

### Prérequis

- Node.js 20+
- Un compte [Supabase](https://supabase.com/) (ou Neon)
- Un compte [Resend](https://resend.com/)

### Installation

```bash
git clone https://github.com/ton-pseudo/Wargame Matchmaker
cd Wargame Matchmaker
npm install
```

### Variables d'environnement

Créer un fichier `.env.local` :

```env
# Auth.js
AUTH_SECRET=                    # openssl rand -base64 32
AUTH_TRUST_HOST=true

# Resend (envoi OTP)
AUTH_RESEND_KEY=re_xxxxxxxxxxxx

# Base de données
DATABASE_URL=postgresql://...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Base de données

```bash
# Générer et appliquer les migrations
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Lancer en développement

```bash
npm run dev
```

---

## Roadmap

- [ ] MVP : auth + profil + calendrier + création/consultation de dispo
- [ ] Notifications email lors d'une prise de contact
- [ ] Localisation (ville / distance) pour filtrer les joueurs proches
- [ ] Page shop / club avec agenda public
- [ ] Application mobile (PWA ou React Native)

---

## Licence

MIT
