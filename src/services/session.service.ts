import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import db from '../db';
import Session from '../models/session.model';

export async function getSessionById(sessionId: string): Promise<Session | null> {
  return db.getRepository(Session).findOneBy({ sessionId });
}

export async function createSession(userId: string, ipAddress: string, key?: string): Promise<Session> {
  const sessionId = randomUUID();
  const keyHash = key !== undefined ? await hash(key, 10) : undefined;

  const session = db.getRepository(Session).create({
    sessionId,
    userId,
    ...(key !== undefined ? { isPersistent: true, keyHash } : { isPersistent: false }),
    ipAddress,
  });

  return db.getRepository(Session).save(session);
}

export async function signOut(sessionId: string) {
  return db.getRepository(Session).update({ sessionId }, { signedOutAt: new Date() });
}
