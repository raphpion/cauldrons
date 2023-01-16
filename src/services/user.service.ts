import User, { IUser } from '../models/user.model';
import { randomUUID } from 'crypto';
import { hash } from 'bcryptjs';

export async function getUserByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email });
}

export async function getUserByUsername(username: string): Promise<IUser | null> {
  return User.findOne({ username });
}

export async function getUserById(userId: string): Promise<IUser | null> {
  return User.findOne({ userId });
}

export async function createUserWithCredentials(username: string, email: string, password: string): Promise<IUser | null> {
  const userId = randomUUID();
  const passwordHash = await hash(password, 10);

  return User.create({
    userId,
    username,
    email,
    password: passwordHash,
    createdAt: new Date(),
    createdBy: userId,
  });
}
