export type ServerSettings = {
  modules: {
    moderation: boolean;
    automod: boolean;
    logging: boolean;
    fireboard: boolean;
    server_counters: boolean;
  };
  settings: {
    loading_reaction: boolean;
    reply_ping: boolean;
  };
  prefixes: string[];
};
