import { compare } from 'bcryptjs';

import { CauldronRequest } from '~/models/request.model';
import { getSessionById } from '~/services/session.service';

export async function getRequestSession(req: CauldronRequest) {
  let sessionId = (req.session as any).sessionId || undefined;
  if (sessionId === undefined) {
    const sessionCookie = req.cookies['cauldrons-session'];
    if (sessionCookie === undefined) return null;

    const parsedCookie = JSON.parse(sessionCookie);
    sessionId = parsedCookie.sessionId;
    const key = parsedCookie.key;

    const session = await getSessionById(sessionId);
    if (session === null) return null;
    if (key === undefined || !compare(key, session.keyHash)) return null;
    (req.session as any).sessionId = session.sessionId;
    return session;
  }
  return getSessionById(sessionId);
}
