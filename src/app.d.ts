// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      token?: string;
      discordToken?: string;
      discordID?: string;
      guildID?: string;
      dashboard_manager?: boolean;
      case_manager?: boolean;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
