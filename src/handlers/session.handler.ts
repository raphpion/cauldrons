import { randomBytes } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import { RequestWithSessionData } from '../models/request.model';
import { createSession, signOut } from '../services/session.service';

export async function handleCreateSession(req: RequestWithSessionData, res: Response, next: NextFunction) {
  try {
    console.log(req.data);
    const { userId } = req.data;

    let persist = false;
    if (req.body.persist) persist = true;
    else if (req.data && req.data.persist) persist = true;

    if (userId === undefined) throw new CauldronError('Missing parameter in session handler: userId', CauldronErrorCodes.INTERNAL);

    const key = persist ? randomBytes(256).toString('hex') : undefined;
    const session = await createSession(userId, req.socket.remoteAddress, key);
    (req.session as any).sessionId = session.sessionId;
    req.session.cookie.maxAge = persist ? 7 * 24 * 60 * 60 * 1000 : null;

    if (persist) {
      res.cookie('cauldrons-session', JSON.stringify({ sessionId: session.sessionId, key }), {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function handleSignOut(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = (req.session as any).sessionId;
    req.session.destroy(async err => {
      if (err) throw err;
      await signOut(sessionId);
      res.clearCookie('connect.sid');
      res.clearCookie('cauldrons-session');
      res.status(204).send();
    });
  } catch (error) {
    next(error);
  }
}
