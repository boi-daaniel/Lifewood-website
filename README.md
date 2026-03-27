# Lifewood Website

Lifewood Website is a Vite + React + TypeScript marketing site and admin portal for Lifewood's AI data solutions business. It includes public-facing pages for services, projects, offices, careers, and company information, plus an authenticated admin area for inbox management, applicants, analytics, and admin user management.

## Features

- Public marketing pages for AI services, AI projects, company information, offices, philanthropy, and internal news
- Careers hub with job applications, resume upload, and a "Message Us" contact flow
- Rule-based support chatbot for routing visitors to the right pages
- Admin authentication with protected routes
- Admin dashboard for message and applicant activity
- Admin inbox and applicant review workflows
- Admin analytics powered by tracked page views
- Super Admin-only admin management flow backed by a serverless API
- Contact message abuse controls including rate limiting, browser limits, honeypot protection, and minimum form-fill timing

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Framer Motion
- Supabase
- EmailJS
- Vercel serverless functions

## Project Structure

```text
.
|-- api/                # Vercel serverless endpoints
|-- components/         # Shared UI and admin layout components
|-- lib/                # Supabase client and shared utilities
|-- pages/              # Route-level pages
|-- App.tsx             # Main router and app shell
|-- index.tsx           # React entry point
|-- vite.config.ts      # Vite configuration
`-- vercel.json         # SPA + API routing for Vercel
```

## Routes At A Glance

### Public routes

- `/`
- `/ai-services`
- `/ai-projects`
- `/about-us`
- `/offices`
- `/philanthropy-impact`
- `/careers`
- `/internal-news`
- `/terms-and-conditions`
- `/what-we-offer/type-a`
- `/what-we-offer/type-b`
- `/what-we-offer/type-c`
- `/what-we-offer/type-d`

### Admin routes

- `/admin/login`
- `/admin/dashboard`
- `/admin/inbox`
- `/admin/applicants`
- `/admin/analytics`
- `/admin/management` (Super Admin only)

## Prerequisites

- Node.js 18+
- npm
- A Supabase project
- An EmailJS account
- A Vercel project if you want to deploy the included serverless APIs

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a local env file:

```bash
copy .env.example .env.local
```

3. Fill in the required environment variables in `.env.local`.

4. Start the dev server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Environment Variables

Copy the values below into `.env.local` for local development, and also configure the server-side values in Vercel for deployed API routes.

### Client-side variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes | Supabase project URL used by the frontend client |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon key for frontend auth, queries, storage, and analytics writes |
| `VITE_ADMIN_EMAIL_DOMAIN` | Optional | Domain hint used on the admin login screen. Defaults to `lifewood.local` |
| `VITE_EMAILJS_SERVICE_ID` | Yes | EmailJS service ID for contact, applicant, and newsletter emails |
| `VITE_EMAILJS_PUBLIC_KEY` | Yes | EmailJS public key |
| `VITE_EMAILJS_ADMIN_EMAIL` | Yes | Admin recipient email address |
| `VITE_EMAILJS_TEMPLATE_ID` | Yes | EmailJS template ID |
| `VITE_PASSWORD_RESET_REDIRECT` | Recommended | Password reset redirect URL for admin auth |

### Server-side variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | Yes | Supabase project URL used by Vercel API routes |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key used by `/api/contact/submit` and `/api/admin/create-user` |

### Legacy / optional variable

`vite.config.ts` still exposes `GEMINI_API_KEY` into the build config, but the current app code in this repository does not actively use Gemini-based features. You can usually leave it unset unless you plan to add code that depends on it.

## Supabase Requirements

This project expects Supabase to handle:

- Admin authentication
- `admin_profiles` table for role-based access control
- `contact_messages` table for contact submissions
- `career_applications` table for applicant records
- `page_views` table for analytics
- `newsletter_subscribers` table for internal news subscriptions
- Storage buckets such as `resumes` and `avatars`

You should also enforce appropriate RLS policies and permissions for frontend-safe access patterns.

## Email Flows

EmailJS is used for:

- Contact message confirmations and admin notifications
- Career application confirmations and admin notifications
- Internal news/newsletter subscription notifications
- Admin replies from inbox and applicant workflows

## API Endpoints

### `POST /api/contact/submit`

Stores contact messages with extra abuse protection:

- per-email submission cap
- in-memory sender rate limiting
- honeypot field filtering
- minimum form completion time

### `POST /api/admin/create-user`

Creates admin users and their `admin_profiles` row. This endpoint requires a valid authenticated bearer token from a user whose profile role is `Super Admin`.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Deployment

This project is configured for Vercel:

- `vercel.json` rewrites `/api/*` to serverless functions
- all other routes rewrite to `index.html` so React Router works as an SPA

For deployment, make sure both client-side and server-side environment variables are configured in your Vercel project settings.

## Notes

- The app uses smooth scrolling and page transitions on the public site.
- Public page views are tracked through Supabase via `lib/analytics.ts`.
- If Supabase is not configured, admin and data-driven flows will gracefully stop working instead of initializing a broken client.
