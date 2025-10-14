# Titanium Dashboard

This repo contains [Titanium](https://github.com/RestartB/titanium/tree/v2)'s web dashboard. It communicates with the local Titanium API to facilitate communication between the bot, database and web UI. Follow the steps below to get started:

> [!IMPORTANT]
> This project is in highly active development. Therefore, I am not accepting PRs or code edits for this repo at this time.

## Running in production

1. run `pnpm install` to install required packages
2. copy the provided `.env.example` file, name it `.env` and fill in any required information
3. run `pnpm run db:push` to create the database and required tables
4. run `pnpm run build` to build server files for production
5. run `node build --env-file=.env` to run the server

## Running the dev server

1. run `pnpm install` to install required packages
2. copy the provided `.env.example` file, name it `.env` and fill in any required information
3. run `pnpm run db:push` to create the database and required tables
4. run `pnpm run dev` to start the dev server
