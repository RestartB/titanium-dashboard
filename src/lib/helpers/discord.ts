import { Link, TextAlignStart, Image, SeparatorHorizontal } from '@lucide/svelte';
import type { ComponentMeta, ValidCids, ViewComponent } from '$lib/interfaces/cv2';

function validateID(id: string) {
  return /^\d{15,20}$/.test(id);
}

export const cv2Metadata: Record<ValidCids, ComponentMeta> = {
  1: {
    cId: 1,
    title: 'Button Row',
    description: 'Add a row of up to 5 link buttons.',
    Icon: Link
  },
  10: {
    cId: 10,
    title: 'Text',
    description: 'Add markdown text.',
    Icon: TextAlignStart
  },
  9: {
    cId: 9,
    title: 'Text with Thumbnail',
    description: 'Add markdown text with a thumbnail to the side.',
    Icon: TextAlignStart
  },
  12: {
    cId: 12,
    title: 'Media Gallery',
    description: 'Add photos and videos via URLs.',
    Icon: Image
  },
  14: {
    cId: 14,
    title: 'Separator',
    description: 'Add a separator.',
    Icon: SeparatorHorizontal
  }
};

export function createComponent(cId: ValidCids, id: string): ViewComponent {
  return {
    cId,
    id,
    content: cId === 9 || cId === 10 ? '' : '_',
    url: 'https://titanium.fyi/assets/logo.png',
    urls: [],
    buttons: [],
    spacing: 1
  };
}

const DiscordPermission = {
  KickMembers: 0x0000000000000002n,
  BanMembers: 0x0000000000000004n,
  Administrator: 0x0000000000000008n,
  ManageChannels: 0x0000000000000010n,
  ManageGuild: 0x0000000000000020n,
  ViewAuditLog: 0x0000000000000080n,
  ViewChannel: 0x0000000000000400n,
  SendMessages: 0x0000000000000800n,
  ManageMessages: 0x0000000000002000n,
  ReadMessageHistory: 0x0000000000010000n,
  ManageRoles: 0x0000000010000000n,
  ManageWebhooks: 0x0000000020000000n,
  ManageNicknames: 0x0000000008000000n,
  ModerateMembers: 0x0000010000000000n,
  AddReactions: 0x0000000000000040n
} as const;

function hasDiscordPermission(permissions: bigint, required: bigint) {
  return (
    (permissions & DiscordPermission.Administrator) === DiscordPermission.Administrator ||
    (permissions & required) === required
  );
}

function hasAnyDiscordPermission(permissions: bigint, required: bigint) {
  return (
    (permissions & DiscordPermission.Administrator) === DiscordPermission.Administrator ||
    (permissions & required) !== 0n
  );
}

function defaultPfpUrl(id: string) {
  return `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(id) >> 22n) % 6n)}.png`;
}

export { DiscordPermission, hasAnyDiscordPermission, hasDiscordPermission, validateID, defaultPfpUrl };
