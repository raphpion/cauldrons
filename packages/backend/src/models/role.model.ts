import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { RoleCodes } from '@cauldrons/models/Role';

@Entity()
export default class Role {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column({ unique: true, type: 'uuid' })
  @Generated('uuid')
  readonly roleId!: string;

  @Column({ unique: true, length: 64 })
  code!: RoleCodes;
}
