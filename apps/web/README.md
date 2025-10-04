# Web App

This is the front-end of the Fullstack Challenge. It is a Next.js 14 application that renders the Movies dashboard and login experience.

## Features
- Movies table with filtering, sorting, and skeleton loading states
- Login form with basic validation and toast feedback
- API routes for authentication and media data (for local development)
- Tailwind CSS styling and reusable UI components

## Prerequisites
- Node.js 20+
- pnpm 8+

## Getting Started
1. Install dependencies from the repository root:
   ```bash
   pnpm install
   ```
2. Copy `.env.example` to `.env` if needed and adjust values. Default `.env` points to the local API service.
3. Start the dev server from `apps/web`:
   ```bash
   pnpm dev
   ```
4. Visit http://localhost:3000 to use the app.

## Available Scripts
Run these commands inside `apps/web`:
- `pnpm dev` � start the development server
- `pnpm lint` � run ESLint
- `pnpm test` � execute unit tests with Vitest
- `pnpm build` � create a production build
- `pnpm start` � serve the production build (after running `pnpm build`)

## Environment Variables
The app reads environment variables from `.env`:
- `NEXT_PUBLIC_API_BASE_URL` � base URL for API requests in the browser
- `AUTH_COOKIE_ACCESS` � name of the access token cookie
- `AUTH_COOKIE_REFRESH` � name of the refresh token cookie

## Basic Usage
- Sign in using the login page; successful login redirects to the dashboard.
- Use the filters on the Movies page to narrow down results by genre or change the sort order.
- Refresh the page or click reset to clear applied filters.

## Production Build
Build the app for production from `apps/web`:
```bash
pnpm build
pnpm start
```
This runs a Next.js server on port 3000 serving the optimized bundle.

