/**
 * Represents a user's profile in the Cauldrons infrastructure.
 */
interface IUserProfile {
  /** The unique identifier of the user associated with this profile. */
  userId: string;

  /** The URL for the user's avatar, if applicable. */
  avatarUrl?: string;

  /** A brief description of the user, if provided. */
  bio?: string;

  /** The unique identifier of the user who created this profile. */
  createdBy: string;

  /** The date and time when the profile was created. */
  createdOn: Date;

  /** The unique identifier of the user who last updated this profile, if applicable. */
  updatedBy?: string;

  /** The date and time when the profile was last updated, if applicable. */
  updatedOn?: Date;
}

/**
 * Represents a user's public profile in the Cauldrons infrastructure.
 */
interface IUserPublicProfile {
  /** The unique identifier of the user associated with this profile. */
  username: string;

  /** The URL for the user's avatar, if applicable. */
  avatarUrl?: string;

  /** A brief description of the user, if provided. */
  bio?: string;
}

export type { IUserProfile, IUserPublicProfile };
