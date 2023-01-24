import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import User from './user.model';

@Entity()
export default class UserProfile {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @OneToOne(() => User, user => user.profile, { cascade: ['remove', 'update'] })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Promise<User>;

  @Column({ length: 2048 })
  avatarUrl: string;

  @Column({ type: 'text' })
  bio: string;

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
}
