import User from '../models/user.model';
import { randomUUID } from 'crypto';
import { hash } from 'bcryptjs';
import { IUpdateUserPayload } from '../schemas/user.schema';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import db from '../db';

export async function getAllUsers(): Promise<User[]> {
  return db.getRepository(User).find();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return db.getRepository(User).findOneBy({ email });
}

export async function getUserByUsername(username: string): Promise<User | null> {
  return db.getRepository(User).findOneBy({ username });
}

export async function getUserById(userId: string): Promise<User | null> {
  return db.getRepository(User).findOneBy({ userId });
}

export async function createUser(username: string, email: string, password: string): Promise<User | null> {
  const userId = randomUUID();
  const passwordHash = await hash(password, 10);

  const user = db.getRepository(User).create({
    userId,
    username,
    email,
    passwordHash,
    createdAt: new Date(),
    createdBy: 'an-admin-user-id', // TODO replace this with actual requester's ID
  });

  return db.getRepository(User).save(user);
}

export async function createUserWithCredentials(username: string, email: string, passwordHash: string): Promise<User | null> {
  const user = db.getRepository(User).create({
    username,
    email,
    passwordHash,
    createdAt: new Date(),
  });

  return db.getRepository(User).save(user);
}

export async function updateUser(userId: string, payload: IUpdateUserPayload): Promise<void> {
  const user = await getUserById(userId);
  if (user === null) throw new CauldronError(`User with ID ${userId} could not be found`, CauldronErrorCodes.NOT_FOUND);

  const payloadWithHash = { ...payload };
  if (payload.password !== undefined) {
    const passwordHash = await hash(payload.password, 10);
    payloadWithHash.password = undefined;
    payloadWithHash.passwordHash = passwordHash;
  }

  await db.getRepository(User).update(user.id, {
    ...payloadWithHash,
    updatedBy: 'an-admin-user-id', // TODO replace this with actual requester's ID
  });
}

export async function deleteUser(userId: string) {
  const user = await getUserById(userId);
  if (user === null) throw new CauldronError(`User with ID ${userId} could not be found`, CauldronErrorCodes.NOT_FOUND);
  return db.getRepository(User).delete(user.id);
}
