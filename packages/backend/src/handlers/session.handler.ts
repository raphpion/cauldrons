import { randomBytes } from 'crypto';
import { NextFunction, Response } from 'express';

import { getRequestSession, getSessionUser } from '~/helpers/session.helper';
import { CauldronRequest } from '~/models/request.model';
import { createSession, signOutSession } from '~/services/session.service';

export async function handleCreateSession(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const user = getSessionUser(req);

    const currentSession = await getRequestSession(req);
    if (currentSession !== null) {
      await signOutSession(currentSession);
    }

    const persist = (req.body.persist) || (req.data && req.data.persist);

    const key = persist ?
      randomBytes(256).toString('hex') :
      undefined;

    const session = await createSession(user, req.socket.remoteAddress || "", key);
    (req.session as any).sessionId = session.sessionId;
    req.session.cookie.maxAge = persist ?
      7 * 24 * 60 * 60 * 1000 :
      undefined;

    if (persist) {
      res.cookie('cauldrons-session', JSON.stringify({ sessionId: session.sessionId, key }), {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
      });
    }

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function handleSignOut(req: CauldronRequest, res: Response, next: NextFunction) {
  try {
    const session = await getRequestSession(req);
    if (session !== null) {
      req.session.destroy(async err => {
        if (err) {
          throw err;
        }

        await signOutSession(session);
        res.clearCookie('connect.sid');
        res.clearCookie('cauldrons-session');
        res.sendStatus(204);
      });
    }
  } catch (error) {
    next(error);
  }
}
