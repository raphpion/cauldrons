/**
 * A Role is an identifier attributed to Users to give them permissions in the Cauldrons infrastructure.
 */
interface IRole {
  /** Unique identifier for the role. Recommended format is UUIDv4. */
  roleId: string;

  /** Unique textual identifier for easier recognition of the Role. */
  code: RoleCodes;
}

/** A RoleCode is a textual identifier for a Role in the Cauldrons infrastructure. */
enum RoleCodes {
  /** A super-user has all permissions across the infrastructure. You don't need to set other roles for admin users. */
  SUPER_USER = 'super-user',

  /** Allows complete CRUD controle over users. It is recommended you only give this role to admin users. */
  USER_MANAGEMENT = 'user-management',

  /** Allows complete CRUD control over user profiles. */
  PROFILE_MANAGEMENT = 'profile-management',
}

export { RoleCodes };
export type { IRole };
