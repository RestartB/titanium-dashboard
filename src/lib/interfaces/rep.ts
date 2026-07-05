export type RepEntry = {
  user_id: string;
  user_name: string | null;
  user_display: string | null;
  user_pfp: string | null;
  rep: string;
  historical: number[];
};

export type RepResponse = {
  total_count: number;
  leaderboard: RepEntry[];
};
