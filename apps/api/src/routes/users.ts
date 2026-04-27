import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const userRoutes = new Hono();

userRoutes.get('/:username', async (c) => {
  const username = c.req.param('username');

  const user = await db.select({
    id: users.id,
    username: users.username,
    born: users.born
  }).from(users).where(eq(users.username, username)).limit(1);

  if (user.length == 0) {
    return c.json({ error: 'user not found' }, 404);
  }

  return c.json(user[0]);
});