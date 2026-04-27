# Titanium Dashboard

This repo contains [Titanium](https://github.com/RestartB/titanium/tree/v2)'s web dashboard. It communicates with the local Titanium API to facilitate communication between the bot, database and web UI. Follow the steps below to get started:

> [!IMPORTANT]
> This project is in highly active development. Therefore, I am not accepting PRs or code edits for this repo at this time.

## Running in production

1. run `pnpm install` to install required packages
2. copy the provided `.env.example` file, name it `.env` and fill in any required information
3. run `pnpm run db:migrate` to create the database and required tables
4. run `pnpm run build` to build server files for production
5. run `node build --env-file=.env` to run the server

## Running the dev server

1. run `pnpm install` to install required packages
2. copy the provided `.env.example` file, name it `.env` and fill in any required information
3. run `pnpm run db:migrate` to create the database and required tables
4. run `pnpm run dev` to start the dev server

## Emojis

You will need to download Twimojis separately as I do not ship these with the dashboard. You can download all emoji SVG files from the [Twimoji GitHub repo](https://github.com/jdecked/twemoji/tree/main/assets/svg), then place them in `static/emojis`. When you next start the dev server or build the dashboard, all emojis in the emoji picker will resolve.

## Migrating Database

If the database changes, you will need to migrate the database using Drizzle.

### Generating Migration File

To generate a migration file, run `pnpm run db:generate`. This will generate a migration file and place it in the `drizzle` folder.

### Complete Migration

To complete the migration to the new database schema, run `pnpm run db:migrate`. This will run all required migration files on the database to bring it in line with the latest schema.
