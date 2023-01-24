import Session from './session.model';
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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Role from './role.model';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, type: 'uuid' })
  @Generated('uuid')
  readonly userId: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Column()
  confirmed: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdBy: Promise<User>;

  @CreateDateColumn()
  createdOn: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: Promise<User>;

  @UpdateDateColumn({ nullable: true })
  updatedOn?: Date;

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
