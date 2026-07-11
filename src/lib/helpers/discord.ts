function validateID(id: string) {
  return /^\d{15,20}$/.test(id);
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
  ModerateMembers: 0x0000010000000000n
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

export { DiscordPermission, hasAnyDiscordPermission, hasDiscordPermission, validateID };
