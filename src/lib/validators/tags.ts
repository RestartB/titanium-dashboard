import { z } from 'zod';

export const tagQuickResponseSchema = z
  .object({
    id: z.uuidv4(),
    tag_id: z.uuidv4().optional(),
    keywords: z.array(z.string().min(1).max(25)).max(5),
    match_whole_word: z.boolean(),
    case_sensitive: z.boolean(),

    ignored_roles: z.array(z.string()).default([]),
    ignored_channels: z.array(z.string()).default([])
  })
  .refine((data) => data.tag_id, {
    message: 'Please select a tag.',
    path: ['tag_id']
  });

export type TagQuickResponseSchema = z.infer<typeof tagQuickResponseSchema>;

export const tagsConfigSchema = z.object({
  allow_user_tags: z.boolean(),
  quick_responses: z.array(tagQuickResponseSchema),
  global_ignored_roles: z.array(z.string()).max(100).default([]),
  global_ignored_channels: z.array(z.string()).max(100).default([])
});

export type TagsConfigSchema = z.infer<typeof tagsConfigSchema>;

const buttonSchema = z.object({
  label: z.string().trim().min(1).max(80),
  url: z.httpUrl().max(512)
});

const TEXT_COMPONENT_IDS = [9, 10];
const BUTTON_ROW_ID = 1;

export const componentSchema = z.object({
  cId: z.literal([1, 9, 10, 12, 14]),
  id: z.uuidv4(),
  content: z.string().trim().min(1).max(1000).optional(),
  url: z.httpUrl().max(2048).optional(),
  urls: z.array(z.httpUrl().max(2048)).max(10).default([]),
  buttons: z.array(buttonSchema).max(5).default([]),
  spacing: z.literal([1, 2]).default(1)
});

type TagWithComponents = {
  components: z.infer<typeof componentSchema>[];
};

function checkComponentLimits({ components }: TagWithComponents, ctx: z.RefinementCtx) {
  const totalChars = components.reduce(
    (total, component) =>
      total + (TEXT_COMPONENT_IDS.includes(component.cId) && component.content ? component.content.length : 0),
    0
  );

  if (totalChars > 4000) {
    ctx.addIssue({
      code: 'custom',
      message: 'Too many characters: please ensure the total length of all text components is less than 4000.',
      path: ['components']
    });
  }

  const totalComponents = components.reduce(
    (total, component) => total + 1 + (component.cId === BUTTON_ROW_ID ? component.buttons.length : 0),
    0
  );

  if (totalComponents > 39) {
    ctx.addIssue({
      code: 'custom',
      message: 'Too many components: please ensure the total length of components and buttons is less than 39',
      path: ['components']
    });
  }
}

export const newTagSchema = z
  .object({
    guildId: z.string().optional(),
    pageKey: z.uuidv4().optional(),
    submitKey: z.uuidv4().optional(),

    name: z.string('Please enter a title.').trim().min(1).max(35),
    cv2: z.boolean().default(false),

    content: z.string('Please enter some content.').trim().max(2000).optional(),
    components: z.array(componentSchema).max(10, 'A max of 10 components per tag is allowed.').default([]),
    colour: z.string().trim().default('#979C9F'),
    spoiler: z.boolean().default(false)
  })
  .refine((data) => !data.cv2 || (data.cv2 && data.components.length > 0), {
    message: 'Please add some components.',
    path: ['components']
  })
  .refine((data) => data.cv2 || (!data.cv2 && data.content), {
    message: 'Please add some content.',
    path: ['content']
  })
  .superRefine(checkComponentLimits);

export const editTagSchema = z
  .object({
    guildId: z.string().optional(),
    pageKey: z.uuidv4().optional(),
    submitKey: z.uuidv4().optional(),
    tagId: z.uuidv4(),

    name: z.string('Please enter a title.').trim().min(1).max(35),
    cv2: z.boolean().default(false),

    content: z.string('Please enter some content.').trim().max(2000).optional(),
    components: z.array(componentSchema).max(10, 'A max of 10 components per tag is allowed.').default([]),
    colour: z.string().trim().default('#979C9F'),
    spoiler: z.boolean().default(false)
  })
  .refine((data) => !data.cv2 || (data.cv2 && data.components.length > 0), {
    message: 'Please add some components.',
    path: ['components']
  })
  .refine((data) => data.cv2 || (!data.cv2 && data.content), {
    message: 'Please add some content.',
    path: ['content']
  })
  .superRefine(checkComponentLimits);
