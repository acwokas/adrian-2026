import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    heroImageSlot: z.string().optional(),
    canonical: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

const fridayFrame = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/friday-frame' }),
  schema: z.object({
    title: z.string(),
    // Optional pre-rendered HTML for the on-page <h1> only, used when the title
    // needs an inline link. The plain-text `title` is still used everywhere else
    // (meta, OG, JSON-LD, share). Trusted author content.
    titleHtml: z.string().optional(),
    date: z.coerce.date(),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing, fridayFrame };
