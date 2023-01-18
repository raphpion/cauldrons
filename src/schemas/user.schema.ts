import Joi from 'joi';

interface IUpdateUserPayload {
  password?: string;
  passwordHash?: string;
}

export const createUserSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const updateUserSchema = Joi.object({
  password: Joi.string().min(6),
});

export type { IUpdateUserPayload };
