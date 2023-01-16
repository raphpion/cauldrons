import { compare } from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import { getSessionById } from '../services/session.service';

export async function isSignedIn(req: Request, res: Response, next: NextFunction) {
  try {
    let sessionId = (req.session as any).sessionId || undefined;
    if (sessionId === undefined) {
      const sessionCookie = req.cookies['cauldrons-session'];
      if (sessionCookie === undefined) throw new CauldronError('Unauthorized', CauldronErrorCodes.UNAUTHORIZED);
      const parsedCookie = JSON.parse(sessionCookie);
      sessionId = parsedCookie.sessionId;
      const key = parsedCookie.key;
      const sessionTemp = await getSessionById(sessionId);
      if (key === undefined || !compare(key, sessionTemp.keyHash)) throw new CauldronError('Unauthorized', CauldronErrorCodes.UNAUTHORIZED);
      (req.session as any).sessionId = sessionTemp.sessionId;
      return next();
    }
    const session = await getSessionById(sessionId);
    if (session === null || !session.isActive()) throw new CauldronError('Unauthorized', CauldronErrorCodes.UNAUTHORIZED);
    next();
  } catch (error) {
    next(error);
  }
}
