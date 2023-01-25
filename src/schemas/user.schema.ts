import Joi from 'joi';
import { RoleCodes } from '../models/role.model';

interface IUpdateUserPayload {
  roles?: RoleCodes[];
}

interface IUpdateUserPayloadParsed {}

export const createUserSchema = Joi.object({
  username: Joi.string().min(3).alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const updateUserSchema = Joi.object({
  roles: Joi.array().items(Joi.string().custom(val => Object.values(RoleCodes).includes(val))),
});

export type { IUpdateUserPayload, IUpdateUserPayloadParsed };
