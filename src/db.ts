import { DataSource } from 'typeorm';
import 'reflect-metadata';
import * as dotenv from 'dotenv';

import Session from './models/session.model';
import User from './models/user.model';

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
  entities: [Session, User],
  subscribers: [],
  migrations: [],
});

export default db;
