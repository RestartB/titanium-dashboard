export interface ServerInfo {
  id: string;
  name: string;
  icon: string;
  banner: string;
  member_count: number;
  features?: string[];
  roles: RoleInfo[];
  categories: CategoryInfo[];
  emojis: EmojiInfo[];
}

export interface RoleInfo {
  id: string;
  name: string;
  colour: string;
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
  id: string | null;
  name: string | null;
  position: number;
  channels: ChannelInfo[];
}

export interface EmojiInfo {
  id: string;
  label: string;
  url: string;
}

export interface ErrorLogs {
  total_count: number;
  errors: ErrorLog[];
}

export interface ErrorLog {
  id: string;
  module: string;
  error: string;
  details: string;
  time_occurred: string;
}
