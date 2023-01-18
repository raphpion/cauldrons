import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  sessionId: string;

  @Column()
  userId: string;

  @Column()
  isPersistent: boolean;

  @Column({ nullable: true })
  keyHash?: string;

  @Column()
  ipAddress: string;

  @Column({ nullable: true })
  signedOutAt?: Date;

  isActive() {
    return this.signedOutAt !== undefined;
  }

  signOut() {
    this.signedOutAt = new Date();
  }
}
