import { Request } from 'express';

interface RequestWithSessionData extends Request {
  data?: {
    userId?: string;
    persist?: boolean;
  };
}

export type { RequestWithSessionData };
