import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '../../.env' });

const url = `postgresql://rizu:${process.env.DB_PASSWORD}@localhost:5432/rizu`;

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url
  }
})