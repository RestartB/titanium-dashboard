import { z } from 'zod';

export const tagsConfigSchema = z.object({
  allow_user_tags: z.boolean(),
  prefix_fallback: z.boolean()
});

export type TagsConfigSchema = z.infer<typeof tagsConfigSchema>;

export const newTagSchema = z.object({
  guildId: z.string(),
  name: z.string('Please enter a title.').trim().min(1).max(35),
  content: z.string('Please enter some content.').trim().min(1).max(1000)
});

export const editTagSchema = z.object({
  guildId: z.string(),
  tagId: z.uuidv4(),
  name: z.string('Please enter a title.').trim().min(1).max(35),
  content: z.string('Please enter some content.').trim().min(1).max(1000)
});
