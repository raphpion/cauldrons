import { RoleCodes } from '@cauldrons/models';

import db from '~/db';
import Role from '~/models/role.model';

export async function getRoleByCode(code: RoleCodes): Promise<Role | null> {
  return db.getRepository(Role).findOneBy({ code });
}
