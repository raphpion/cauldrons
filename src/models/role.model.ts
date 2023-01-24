import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'uuid' })
  @Generated('uuid')
  roleId: string;

  @Column({ unique: true })
  code: RoleCodes;
}

export enum RoleCodes {
  SUPER_USER = 'super-user',
  USER_MANAGEMENT = 'user-management',
}
