import { compare } from 'bcryptjs';
import CauldronError, { CauldronErrorCodes } from '~/models/error.model';

import { CauldronRequest } from '~/models/request.model';
import User from '~/models/user.model';
import { getSessionById } from '~/services/session.service';

export async function getRequestSession(req: CauldronRequest) {
  let sessionId = (req.session as any).sessionId || undefined;
  if (sessionId === undefined) {
    const sessionCookie = req.cookies['cauldrons-session'];
    if (sessionCookie === undefined) {
      return null;
    }

    const parsedCookie = JSON.parse(sessionCookie);
    sessionId = parsedCookie.sessionId;
    const key = parsedCookie.key;

    const session = await getSessionById(sessionId);
    if (session === null) {
      return null;
    }
    
    if (key === undefined || session.keyHash === undefined || !compare(key, session.keyHash!)) {
      return null;
    }

    (req.session as any).sessionId = session.sessionId;
    return session;
  }
  return getSessionById(sessionId);
}

export function getSessionUser(req: CauldronRequest) {
  if (req.data === undefined || req.data.user === undefined) {
    throw new CauldronError('Session user could not be retrieved!', CauldronErrorCodes.NOT_FOUND);
  }
  return req.data.user;
}