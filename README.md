# Lifewood Website

Lifewood Website is a React and TypeScript web app for Lifewood's public brand presence and internal admin operations. The project combines a marketing site, careers funnel, contact workflows, lightweight visitor support, and an authenticated admin area for operational review.

## Overview

The site includes:

- public pages for company, services, projects, offices, and impact content
- a careers experience for applications and candidate outreach
- contact and newsletter flows
- an internal admin portal for inbox, applicants, analytics, and admin management

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Framer Motion
- Supabase
- EmailJS
- Vercel

## Project Structure

```text
.
|-- api/          # Serverless endpoints
|-- components/   # Shared UI components
|-- lib/          # Shared utilities and integrations
|-- pages/        # Route-level screens
|-- App.tsx       # Main app router
|-- index.tsx     # App entry
`-- vercel.json   # Deployment rewrites
```

## Running Locally

1. Install dependencies:

```bash
npm install
```

2. Create your own local environment file and add the configuration required for your services.

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Deployment

The app is set up for Vercel deployment with SPA routing and serverless API endpoints. If you deploy it elsewhere, make sure client-side routing and API handling are configured equivalently.

## Notes

- This public repository does not include deployment secrets or environment templates.
- Local and production environments require external service configuration to enable all features.
- Some workflows depend on Supabase storage, auth, and database tables, as well as email delivery integrations.
