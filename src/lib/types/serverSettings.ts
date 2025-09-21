export type ServerSettings = {
	modules: {
		moderation: boolean;
		automod: boolean;
		logging: boolean;
		fireboard: boolean;
	};
	settings: {
		loading_reaction: boolean;
		reply_ping: boolean;
	};
	prefixes: string[];
};
