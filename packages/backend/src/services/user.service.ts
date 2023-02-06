import { hash } from 'bcryptjs';

import db from '~/db';
import CauldronError, { CauldronErrorCodes } from '~/models/error.model';
import Role from '~/models/role.model';
import User from '~/models/user.model';
import { IUpdateUserPayload } from '~/schemas/user.schema';
import { getRoleByCode } from './role.service';

export async function getAllUsers(): Promise<User[]> {
  return db.getRepository(User).find();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return db.getRepository(User).findOneBy({ emailNormalized: email });
}

export async function getUserById(userId: string): Promise<User | null> {
  return db.getRepository(User).findOneBy({ userId });
}

export async function getUserByUsername(username: string): Promise<User | null> {
  return db.getRepository(User).findOneBy({ usernameNormalized: username });
}

export async function createUser(manager: User, username: string, email: string, password: string): Promise<User> {
  const passwordHash = await hash(password, 10);

  const user = db.getRepository(User).create({
    username,
    usernameNormalized: username.toLowerCase(),
    email,
    emailNormalized: email.toLowerCase(),
    passwordHash,
    confirmed: false,
  });

  user.createdBy = Promise.resolve(manager);
  return db.getRepository(User).save(user);
}

export async function createUserWithCredentials(username: string, email: string, passwordHash: string): Promise<User> {
  const user = db.getRepository(User).create({
    username,
    usernameNormalized: username.toLowerCase(),
    email,
    emailNormalized: email.toLowerCase(),
    passwordHash,
    confirmed: false,
  });

  user.createdBy = Promise.resolve(user);

  return db.getRepository(User).save(user);
}

export async function updateUser(userId: string, payload: IUpdateUserPayload, manager?: User): Promise<User> {
  const user = await getUserById(userId);
  if (user === null) {
    throw new CauldronError(`User with ID ${userId} could not be found`, CauldronErrorCodes.NOT_FOUND);
  }

  const { roles, ...updates } = payload;
  const fetchedRoles: Role[] = [];
  if (roles !== undefined) {
    try {
      await Promise.all(roles.map(async code => {
        const role = await getRoleByCode(code);
        if (role) {
          fetchedRoles.push(role);
        }
      }));
    } catch (error) {
      throw error;
    }
  
    user.roles = Promise.resolve(fetchedRoles);
  }
  
  user.updatedBy = manager !== undefined ?
    Promise.resolve(manager) :
    Promise.resolve(user);

  db.getRepository(User).merge(user, updates);
  return db.getRepository(User).save(user);
}

export async function deleteUser(userId: string) {
  const user = await getUserById(userId);
  if (user === null) {
    throw new CauldronError(`User with ID ${userId} could not be found`, CauldronErrorCodes.NOT_FOUND);
  }
  
  return db.getRepository(User).delete(user.id);
}
