export interface ServerInfo {
	id: string;
	name: string;
	icon: string;
	banner: string;
	member_count: number;
	roles: RoleInfo[];
	channels: ChannelInfo[];
	categories: CategoryInfo[];
}

export interface RoleInfo {
	id: string;
	name: string;
	color: number;
	hoist: boolean;
	position: number;
}

export interface ChannelInfo {
	id: string;
	name: string;
	type: string;
	position: number;
	category: string | null;
}

export interface CategoryInfo {
	id: string;
	name: string;
	position: number;
}
