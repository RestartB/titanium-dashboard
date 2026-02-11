CREATE TABLE `token` (
	`token` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`token_expires_at` integer NOT NULL,
	`discord_token` text NOT NULL,
	`discord_token_iv` text NOT NULL,
	`discord_expires_in` integer NOT NULL,
	`discord_user_id` text NOT NULL
);
