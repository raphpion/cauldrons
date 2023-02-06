import { NextFunction, Response } from 'express';

import { getRequestSession } from '~/helpers/session.helper';
import CauldronError, { CauldronErrorCodes } from '~/models/error.model';
import { CauldronRequest } from '~/models/request.model';

export async function isSignedIn(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const session = await getRequestSession(req);
    if (session === null || !session.isActive()) {
      throw new CauldronError('Unauthorized', CauldronErrorCodes.UNAUTHORIZED);
    }
    
    req.data = { ...req.data, user: session.user };
    next();
  } catch (error) {
    next(error);
  }
}
