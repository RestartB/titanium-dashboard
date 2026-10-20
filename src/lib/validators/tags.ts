import { z } from 'zod';

export const tagsConfigSchema = z.object({
  allow_user_tags: z.boolean()
});

export type TagsConfigSchema = z.infer<typeof tagsConfigSchema>;

const buttonSchema = z.object({
  label: z.string().trim().min(1).max(80),
  url: z.httpUrl()
});

export const componentSchema = z.object({
  cId: z.literal([1, 9, 10, 12, 14]),
  id: z.uuidv4(),
  content: z.string().trim().min(1).max(1000).optional(),
  url: z.httpUrl().optional(),
  urls: z.array(z.httpUrl()).default([]),
  buttons: z.array(buttonSchema).default([]),
  spacing: z.literal([1, 2]).default(1)
});

export const newTagSchema = z
  .object({
    guildId: z.string(),
    name: z.string('Please enter a title.').trim().min(1).max(35),
    cv2: z.boolean().default(false),
    content: z.string().trim().max(2000).optional(),
    components: z.array(componentSchema).max(10, 'A max of 10 components per tag is allowed.').default([])
  })
  .refine((data) => !data.cv2 || (data.cv2 && data.components.length > 0), {
    message: 'Please add some components.',
    path: ['components']
  })
  .refine((data) => data.cv2 || (!data.cv2 && data.content), {
    message: 'Please add some content.',
    path: ['content']
  });

export const editTagSchema = z.object({
  guildId: z.string(),
  tagId: z.uuidv4(),
  cv2: z.boolean().default(false),
  name: z.string('Please enter a title.').trim().min(1).max(35),
  content: z.string('Please enter some content.').trim().min(1).max(2000),
  components: z.array(componentSchema)
});
