import { hash } from 'bcryptjs';

import db from '~/db';
import Session from '~/models/session.model';
import User from '~/models/user.model';

export async function getSessionById(sessionId: string): Promise<Session | null> {
  return db.getRepository(Session).findOneBy({ sessionId });
}

export async function createSession(user: User, ipAddress: string, key?: string): Promise<Session> {
  const keyHash = key !== undefined ? await hash(key, 10) : undefined;
  const session = db.getRepository(Session).create({
    ...(key !== undefined ? { isPersistent: true, keyHash } : { isPersistent: false }),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ipAddress,
  });
  session.user = user;
  return db.getRepository(Session).save(session);
}

export async function signOutSession(session: Session) {
  return db.getRepository(Session).update({ id: session.id }, { signedOutAt: new Date() });
}
