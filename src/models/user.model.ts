import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  userId: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @Column({ nullable: true })
  updatedBy?: string;

  getPersonalProfile(): IUserPersonalProfile {
    return {
      userId: this.userId,
      username: this.username,
      email: this.email,
    };
  }

  getPublicProfile(): IUserPublicProfile {
    return {
      userId: this.userId,
      username: this.username,
    };
  }
}

interface IUserPersonalProfile {
  userId: string;
  username: string;
  email: string;
}

interface IUserPublicProfile {
  userId: string;
  username: string;
}

export type { IUserPersonalProfile, IUserPublicProfile };
