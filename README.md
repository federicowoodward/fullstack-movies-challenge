Fullstack Challenge

This repository contains a complete fullstack solution for the Node.js Development Challenge, implemented as a monorepo with Docker support.

The project demonstrates backend and frontend integration using modern technologies:

API: Node.js (TypeScript, Express, TypeORM, PostgreSQL)

Web: Next.js 14 (React, Tailwind)

Scripts: CSV generator using the OMDb public API

Docker: Fully functional stack with one command

Overview

The original challenge aimed to evaluate:

JWT authentication (with refresh tokens)

CRUD endpoints for movies, TV shows, actors, and directors

Relational modeling (movies ↔ actors/directors, tv shows ↔ seasons/episodes)

Filtering and sorting by fields

A front-end to consume and visualize the API

This implementation extends those goals with:

Dockerized fullstack environment

CSV-based seeding via TypeORM migrations

Swagger documentation for the API

A functional web dashboard with login and filtering UI

Project Structure
fullstack-challenge/
│
├── apps/
│ ├── api/ # REST API (Express + TypeORM + Swagger)
│ ├── web/ # Next.js 14 frontend (movies dashboard)
│ └── scripts/ # Helper scripts (e.g., OMDb → CSV)
│
├── docker/ # Docker configs for services
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
└── README.md

Quick Start (Docker)

Start everything with a single command:

docker-compose up -d

Once the containers are running:

API available at → http://localhost:3001

Swagger docs → http://localhost:3001/docs

Web app → http://localhost:3000

The database is automatically seeded on first run via TypeORM migrations.

Development Notes
Local Setup (without Docker)

Install dependencies:

pnpm install

Run each service manually:

pnpm --filter @fs/api dev
pnpm --filter @fs/web dev

PostgreSQL must be running locally or via container.

Environment Variables

Each app contains its own .env.example, but the main ones are:

Variable Description
NEXT_PUBLIC_API_BASE_URL API base URL for frontend
AUTH_COOKIE_ACCESS Access token cookie name
AUTH_COOKIE_REFRESH Refresh token cookie name
DB_HOST, DB_USER, DB_PASSWORD, DB_NAME Postgres connection settings
JWT_SECRET, JWT_REFRESH_SECRET Token secrets for the API
Applications
API

TypeScript + Express + TypeORM service that exposes authenticated routes for movies and TV shows.
See apps/api/README.md
for full details.

Web

Next.js 14 frontend for browsing and filtering media data.
See apps/web/README.md
.

Scripts

Utility to generate CSV seed data from the OMDb API.
See apps/scripts/omdb-to-csv/README.md
.

Tech Stack
Layer Technologies
Backend Node.js 20, Express, TypeORM, PostgreSQL
Frontend Next.js 14, React, TailwindCSS
Auth JWT (Access + Refresh tokens)
Infra Docker, Docker Compose
Tooling pnpm, ESLint, Swagger, Vitest
Development Commands

Run migrations and seeding:

pnpm --filter @fs/api db:migration:run

Rebuild the CSV seed file:

pnpm --filter @fs/scripts omdb:csv

Environment variables can be mapped or overridden in docker-compose.yml.

Challenge Context

The goal of this project was to demonstrate fullstack proficiency using Node.js, PostgreSQL, TypeORM, and modern front-end tooling, following the constraints and expectations described in the original challenge statement.

Author: Federico Woodward
License: MIT
