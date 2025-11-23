import { z } from 'zod';

export const createLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  code: z.string().regex(/^[a-zA-Z0-9-]{3,50}$/, 'Code must be 3-50 alphanumeric characters or hyphens').optional(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;

