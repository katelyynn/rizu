import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { jwtVerify } from 'jose';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const settingsRoutes = new Hono();

settingsRoutes.patch('/avatar', async (c) => {
  try {
    const token = getCookie(c, 'rizuToken');
    if (!token) return c.json({ error: 'unauthorised' }, 401);

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const userId = payload.id as string;
    if (!userId) {
      return c.json({ error: 'invalid token' }, 401);
    }

    const { avatar } = await c.req.json();

    if (!avatar) {
      return c.json({ error: 'missing required fields: avatar' }, 400);
    }

    await db.update(users).set({ avatar }).where(eq(users.id, userId));

    return c.json({ message: 'updated avatar', avatar });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});