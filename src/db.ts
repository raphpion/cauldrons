import { DataSource } from 'typeorm';
import 'reflect-metadata';
import * as dotenv from 'dotenv';

import Session from './models/session.model';
import User from './models/user.model';
import Role from './models/role.model';

dotenv.config();

const db = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_URL,
  port: parseInt(`${process.env.POSTGRES_PORT}`),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: false,
  entities: [Role, Session, User],
  subscribers: [],
  migrations: ['./migrations/**/*{.ts,.js}'],
});

export default db;
