export type LeaderboardEntry = {
  user_id: string;
  user_name: string | null;
  user_display: string | null;
  user_pfp: string | null;
  xp: string;
  level: number;
  historical: number[];
};

export type LeaderboardResponse = {
  total_count: number;
  leaderboard: LeaderboardEntry[];
};
