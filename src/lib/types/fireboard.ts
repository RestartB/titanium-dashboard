export type FireboardSettings = {
	global_ignored_roles: string[];
	global_ignored_channels: string[];
	boards: FireboardBoard[];
};

export type FireboardBoard = {
	id?: string;
	channel_id: string;
	reaction: string;
	threshold: number;
	ignore_bots: boolean;
	ignore_self_reactions: boolean;
	ignored_roles: string[];
	ignored_channels: string[];
};
