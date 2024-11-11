// src/types/express.d.ts

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        // Add other properties if needed
      };
    }
  }
}

export { };