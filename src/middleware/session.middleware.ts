import { NextFunction, Request, Response } from 'express';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import { getSessionById } from '../services/session.service';

export async function isSignedIn(req: Request, res: Response, next: NextFunction) {
  const sessionId = (req.session as any).sessionId || undefined;
  if (sessionId === undefined) throw new CauldronError('Unauthorized', CauldronErrorCodes.UNAUTHORIZED);
  const session = await getSessionById(sessionId);
  if (session === null || !session.isActive()) throw new CauldronError('Unauthorized', CauldronErrorCodes.UNAUTHORIZED);
  next();
}
