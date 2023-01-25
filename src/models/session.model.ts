import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.model';

@Entity()
export default class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  sessionId: string;

  @ManyToOne(() => User, user => user.sessions, { eager: true })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column()
  isPersistent: boolean;

  @Column({ nullable: true, length: 256 })
  keyHash?: string;

  @Column({ length: 64 })
  ipAddress: string;

  @Column({ nullable: true })
  signedOutAt?: Date;

  isActive() {
    return this.signedOutAt !== undefined;
  }
}
