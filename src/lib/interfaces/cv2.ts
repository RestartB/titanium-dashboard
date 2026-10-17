import type { Component } from 'svelte';

export type BaseComponent = {
  id: string;
  title: string;
  description: string;
  Icon: Component;
};

export type Button = {
  url: string;
  label: string;
};

export type ButtonRow = BaseComponent & {
  cId: 1;
  buttons: Button[];
};

export type TextDisplay = BaseComponent & {
  cId: 10;
  content: string;
};

export type TextThumbnail = BaseComponent & {
  cId: 9;
  content: string;
  url: string;
};

export type MediaGallery = BaseComponent & {
  cId: 12;
  urls: string[];
};

export type Separator = BaseComponent & {
  cId: 14;
  spacing: 1 | 2;
};

export type ViewComponent = ButtonRow | TextDisplay | TextThumbnail | MediaGallery | Separator;
