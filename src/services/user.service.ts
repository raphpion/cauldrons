import User from '../models/user.model';
import { hash } from 'bcryptjs';
import { IUpdateUserPayloadParsed, IUpdateUserPayload } from '../schemas/user.schema';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import db from '../db';
import { getRoleByCode } from './role.service';
import Role from '../models/role.model';

export async function getAllUsers(): Promise<User[]> {
  return db.getRepository(User).find();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return db.getRepository(User).findOneBy({ email });
}

export async function getUserById(userId: string): Promise<User | null> {
  return db.getRepository(User).findOneBy({ userId });
}

export async function getUserByUsername(username: string): Promise<User | null> {
  return db.getRepository(User).findOneBy({ username });
}

export async function createUser(manager: User, username: string, email: string, password: string): Promise<User | null> {
  const passwordHash = await hash(password, 10);

  const user = db.getRepository(User).create({
    username,
    email,
    passwordHash,
    confirmed: false,
    createdOn: new Date(),
  });

  user.createdBy = Promise.resolve(manager);
  return db.getRepository(User).save(user);
}

export async function createUserWithCredentials(username: string, email: string, passwordHash: string): Promise<User | null> {
  const user = db.getRepository(User).create({
    username,
    email,
    passwordHash,
    confirmed: false,
    createdOn: new Date(),
  });

  user.createdBy = Promise.resolve(user);

  return db.getRepository(User).save(user);
}

export async function updateUser(userId: string, payload: IUpdateUserPayload, manager?: User): Promise<void> {
  const user = await getUserById(userId);
  if (user === null) throw new CauldronError(`User with ID ${userId} could not be found`, CauldronErrorCodes.NOT_FOUND);

  const { roles, ...updates } = payload;
  let fetchedRoles: Role[] = [];
  try {
    fetchedRoles = await Promise.all(roles.map(code => getRoleByCode(code)));
    console.log(fetchedRoles);
  } catch (error) {
    throw error;
  }

  user.roles = Promise.resolve(fetchedRoles);
  db.getRepository(User).merge(user, updates);

  await db.getRepository(User).save(user);
}

export async function deleteUser(userId: string) {
  const user = await getUserById(userId);
  if (user === null) throw new CauldronError(`User with ID ${userId} could not be found`, CauldronErrorCodes.NOT_FOUND);
  return db.getRepository(User).delete(user.id);
}
