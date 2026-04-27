import { Hono } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const userRoutes = new Hono();

userRoutes.get('/:slug', async (c) => {
  const slug = c.req.param('slug');

  const user = await db.select({
    id: users.id,
    username: users.username,
    slug: users.slug,
    born: users.born
  }).from(users).where(eq(users.slug, slug)).limit(1);

  if (user.length == 0) {
    return c.json({ error: 'user not found' }, 404);
  }

  return c.json(user[0]);
});

userRoutes.get('/', async (c) => {
  const allUsers = await db.select({
    id: users.id,
    username: users.username,
    slug: users.slug,
    born: users.born
  }).from(users);

  return c.json(allUsers);
});