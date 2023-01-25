import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import User from './user.model';

@Entity()
export default class UserProfile {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @OneToOne(() => User, user => user.profile, { cascade: ['remove', 'update'] })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Promise<User>;

  @Column({ length: 2048, nullable: true })
  avatarUrl?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

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

  async getPublicProfile(): Promise<IUserProfile> {
    const user = await this.user;
    return {
      username: user.username,
      avatarUrl: this.avatarUrl,
      bio: this.bio,
    };
  }
}

interface IUserProfile {
  username: string;
  avatarUrl: string;
  bio: string;
}

export type { IUserProfile };
