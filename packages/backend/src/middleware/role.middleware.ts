import { NextFunction, Response } from 'express';

import { RoleCodes } from '@cauldrons/models';

import { getRequestSession } from '~/helpers/session.helper';
import CauldronError, { CauldronErrorCodes } from '~/models/error.model';
import { CauldronRequest } from '~/models/request.model';

export function hasRole(code: RoleCodes) {
  return async (req: CauldronRequest, res: Response, next: NextFunction) => {
    try {
      const session = await getRequestSession(req);
      if (!session || !session.user) throw new CauldronError('Unauthorized', CauldronErrorCodes.UNAUTHORIZED);

      const roles = await session.user.roles;
      if (!roles.find(x => x.code === RoleCodes.SUPER_USER || x.code === code))
        throw new CauldronError('User has insufficient permission', CauldronErrorCodes.FORBIDDEN);

      req.data = { ...req.data, user: session.user };
      next();
    } catch (error) {
      next(error);
    }
  };
}
