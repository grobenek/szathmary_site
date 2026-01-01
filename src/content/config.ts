import { defineCollection, z } from "astro:content";

export const collections = {
  blog: defineCollection({
    schema: z.object({
      title: z.string(),
      date: z.date(),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().default(false),
      updated: z.date().optional(),
      readingTime: z.number().optional(),
    }),
  }),
};
