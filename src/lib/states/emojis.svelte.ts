import type { Emoji, MessagesDataset, ShortcodesDataset } from 'emojibase';

export const emojiData: {
  loaded: boolean;
  emojis: Emoji[] | undefined;
  groupsSubgroups: MessagesDataset | undefined;
  shortcodes: ShortcodesDataset | undefined;
} = $state({ loaded: false, emojis: undefined, groupsSubgroups: undefined, shortcodes: undefined });
