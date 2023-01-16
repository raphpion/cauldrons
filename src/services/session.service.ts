import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import Session, { ISession } from '../models/session.model';

export async function getSessionById(sessionId: string): Promise<ISession | null> {
  return Session.findOne({ sessionId });
}

export async function createSession(userId: string, ipAddress: string, isPersistent: boolean): Promise<ISession> {
  const sessionId = randomUUID();

  return Session.create({
    sessionId,
    userId,
    isPersistent,
    ipAddress,
  });
}

export async function signOut(sessionId: string) {
  return Session.updateOne({ sessionId }, { signedOutAt: new Date() });
}
