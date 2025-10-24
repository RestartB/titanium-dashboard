export interface BouncerRule {
  id: string;
  enabled: boolean;
  criteria: BouncerCriteria[];
  actions: BouncerAction[];
}

export interface BouncerCriteria {
  type: string;
  account_age?: number;
  words: string[];
  match_whole_word: boolean;
  case_sensitive: boolean;
}

export interface BouncerAction {
  type: string;
  duration?: number;
  role_id?: string;
  reason?: string;
  message_content?: string;
  dm_user?: boolean;
}

export interface BouncerSettings {
  rules: BouncerRule[];
}
