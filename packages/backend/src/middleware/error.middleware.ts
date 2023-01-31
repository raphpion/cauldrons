import { Response, NextFunction } from 'express';

import CauldronError, { CauldronErrorCodes, CauldronErrorStatus } from '~/models/error.model';
import { CauldronRequest } from '~/models/request.model';

export function errorHandler(err: Error, req: CauldronRequest, res: Response, next: NextFunction) {
  if (err instanceof CauldronError) {
    console.error(err);
    return res.status(CauldronErrorStatus[err.code]).json({ ...err });
  }
  console.error(err);
  return res.status(500).json({ ...new CauldronError('An unexpected error has occured.', CauldronErrorCodes.UNKNOWN) });
}
