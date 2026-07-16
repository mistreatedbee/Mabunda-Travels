# Mabunda Travels

A travel booking website built with Vite, React, TypeScript, and Tailwind CSS.

## Features

- Responsive landing page with a hero section
- Lodges showcase and deals section
- FAQ and contact section
- WhatsApp quick contact button
- Modern Tailwind-based styling for mobile and desktop

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the local URL shown in the terminal.

## Build for production

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Environment

Create a `.env` file for any local secrets or API keys. The repository already ignores local env files.

Example env values:

```bash
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

## Booking backend

The contact form now submits through a Vercel serverless API route at `api/bookings.ts`, which inserts enquiries into the Supabase `bookings` table.

Make sure your Vercel project has `SUPABASE_URL` and `SUPABASE_SECRET_KEY` set in production.

## Notes

This repository is currently configured for Vite and TypeScript with Tailwind CSS styling.
