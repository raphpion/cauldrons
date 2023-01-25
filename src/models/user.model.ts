import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Role from './role.model';
import Session from './session.model';
import UserProfile from './userProfile.model';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, type: 'uuid' })
  @Generated('uuid')
  readonly userId: string;

  @Column({ unique: true, length: 256 })
  email: string;

  @Column({ unique: true, length: 256 })
  emailNormalized: string;

  @Column({ unique: true, length: 32 })
  username: string;

  @Column({ unique: true, length: 32 })
  usernameNormalized: string;

  @Column({ length: 64 })
  passwordHash: string;

  @Column()
  confirmed: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdBy: Promise<User>;

  @CreateDateColumn({ type: 'timestamp' })
  createdOn: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: Promise<User>;

  @UpdateDateColumn({ nullable: true, type: 'timestamp' })
  updatedOn?: Date;

  @OneToOne(() => UserProfile, profile => profile.user, { nullable: true })
  profile?: Promise<UserProfile>;

  @OneToMany(() => Session, session => session.user)
  sessions: Session[];

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
    joinColumns: [{ name: 'userId', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'roleId', referencedColumnName: 'id' }],
  })
  roles: Promise<Role[]>;

  async getUserInfo(): Promise<IUserInfo> {
    const [createdBy, updatedBy] = await Promise.all([this.createdBy, this.updatedBy]);

    return {
      userId: this.userId,
      email: this.email,
      username: this.username,
      confirmed: this.confirmed,
      createdOn: this.createdOn,
      ...(updatedBy && this.updatedOn !== null && { updatedOn: this.updatedOn }),
      ...(createdBy && { createdBy: createdBy.username }),
      ...(updatedBy && { updatedBy: updatedBy.username }),
    };
  }
}

interface IUserInfo {
  userId: string;
  email: string;
  username: string;
  confirmed: boolean;
  createdBy: string;
  createdOn: Date;
  updatedBy?: string;
  updatedOn?: Date;
}

export type { IUserInfo };
