import mongoose from 'mongoose';

export async function setupDatabaseConnection() {
  const dbUrl = process.env.MONGO_DATABASE_URL;
  const dbPort = process.env.MONGO_DATABASE_PORT;
  const dbUser = process.env.MONGO_DATABASE_USER;
  const dbPassword = process.env.MONGO_DATABASE_PASSWORD;
  const dbName = process.env.MONGO_DATABASE_NAME;

  mongoose.set('strictQuery', false);
  return mongoose.connect(`mongodb://${dbUser}:${dbPassword}@${dbUrl}:${dbPort}/?authMechanism=DEFAULT`, { dbName });
}
