import { Request } from 'express';
import User from './user.model';

interface CauldronRequest extends Request {
  data?: {
    user?: User;
    persist?: boolean;
  };
}

export type { CauldronRequest };
