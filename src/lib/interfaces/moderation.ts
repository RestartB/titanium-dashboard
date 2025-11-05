export type ServerModerationSettings = {
  dm_users: boolean;
  delete_confirmation: boolean;
};

export type CasesResponse = {
  cases: ModerationCase[];
  total_count: number;
};

export type ModerationCase = {
  id: string;
  type: string;
  user_id: string;
  user_name: string;
  user_display: string;
  user_pfp: string;
  creator_id: string;
  creator_name: string;
  creator_display: string;
  creator_pfp: string;
  description: string;
  external: string;
  resolved: boolean;
  comments: ModerationCaseComment[];
  time_created: string;
  time_expires?: string | null;
  time_updated?: string | null;
};

export type ModerationCaseComment = {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_display: string;
  creator_pfp: string;
  content: string;
  time_created: string;
};
