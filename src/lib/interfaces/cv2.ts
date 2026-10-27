import type { Component } from 'svelte';

export type ValidCids = 1 | 9 | 10 | 12 | 14;

export type ViewComponent = {
  cId: ValidCids;
  id: string;
  content: string;
  url: string;
  urls: string[];
  buttons: Button[];
  spacing: 1 | 2;
};

export type Button = {
  url: string;
  label: string;
};

export type ComponentMeta = {
  cId: ValidCids;
  title: string;
  description: string;
  Icon: Component;
};
