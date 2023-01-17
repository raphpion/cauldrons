import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';

export function validate(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) throw new CauldronError(error.message, CauldronErrorCodes.INVALID_PARAMETER);
    next();
  };
}
