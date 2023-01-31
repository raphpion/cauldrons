/**
 * Represents a user in the Cauldrons infrastructure.
 */
interface IUser {
  /** Unique identifier for the user. Recommended format is UUIDv4. */
  userId: string;

  /** The user's email address. */
  email: string;

  /** The user's username. */
  username: string;

  /** Indicates whether the user's email address has been confirmed. */
  confirmed: boolean;

  /** The unique identifier of the user who created this user account. */
  createdBy: string;

  /** The date and time when the user account was created. */
  createdOn: Date;

  /** The unique identifier of the user who last updated this user account, if applicable. */
  updatedBy?: string;

  /** The date and time when the user account was last updated, if applicable. */
  updatedOn?: Date;
}

export type { IUser };
