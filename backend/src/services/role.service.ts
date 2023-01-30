import db from '../db';
import Role, { RoleCodes } from '../models/role.model';

export async function getRoleByCode(code: RoleCodes): Promise<Role | null> {
  return db.getRepository(Role).findOneBy({ code });
}
