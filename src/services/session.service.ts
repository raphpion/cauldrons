import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import Session, { ISession } from '../models/session.model';

export async function getSessionById(sessionId: string): Promise<ISession | null> {
  return Session.findOne({ sessionId });
}

export async function createSession(userId: string, ipAddress: string, key?: string): Promise<ISession> {
  const sessionId = randomUUID();
  const keyHash = key !== undefined ? await hash(key, 10) : undefined;

  return Session.create({
    sessionId,
    userId,
    ...(key !== undefined ? { isPersistent: true, keyHash } : { isPersistent: false }),
    ipAddress,
  });
}

export async function signOut(sessionId: string) {
  return Session.updateOne({ sessionId }, { signedOutAt: new Date() });
}
