export type ServerCounterSettings = {
  channels: ServerCounterChannel[];
};

export type ServerCounterChannel = {
  id?: string;
  name: string;
  type: string;
};
