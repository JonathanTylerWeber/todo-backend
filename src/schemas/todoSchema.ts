import { z } from 'zod';

const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(), // Optional field
});

export default todoSchema;