import Joi from 'joi';
import { Response, NextFunction } from 'express';
import CauldronError, { CauldronErrorCodes } from '../models/error.model';
import { CauldronRequest } from '../models/request.model';

export function validate(schema: Joi.ObjectSchema) {
  return (req: CauldronRequest, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) throw new CauldronError(error.message, CauldronErrorCodes.INVALID_PARAMETER);
    next();
  };
}
