export type CasesResponse = {
  cases: ModerationCase[];
  total_count: number;
};

export type ModerationCase = {
  id: string;
  type: string;
  user_id: string;
  user_name: string | null;
  user_discrim?: string | null;
  user_display: string | null;
  user_pfp: string | null;
  creator_id: string;
  creator_name: string | null;
  creator_discrim?: string | null;
  creator_display: string | null;
  creator_pfp: string | null;
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
  creator_name: string | null;
  creator_discrim?: string | null;
  creator_display: string | null;
  creator_pfp: string | null;
  content: string;
  time_created: string;
};
