import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const url = `postgresql://rizu:${process.env.DB_PASSWORD}@localhost:5432/rizu`;

const client = postgres(url);
export const db = drizzle(client);