import { Hono } from 'hono';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import bcrypt from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import { getCookie, setCookie } from 'hono/cookie';
import slugify from 'slugify';

export const authRoutes = new Hono();

authRoutes.post('/register', async (c) => {
  try {
    const { username, email, password } = await c.req.json();

    if (!username || !email || !password) {
      return c.json({ error: 'missing required fields: username, email, password' }, 400);
    }

    const cleanedUsername = username.trim();
    const slug = slugify(cleanedUsername, { lower: true, strict: true });

    const existingSlug = await db.select().from(users).where(eq(users.slug, slug)).limit(1);
    if (existingSlug.length > 0) {
      return c.json({ error: 'username is already in use' }, 409);
    }

    if (password.length < 6) {
      return c.json({ error: 'password must be at least 6 characters' }, 400);
    }

    const existingEmail = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingEmail.length > 0) {
      return c.json({ error: 'email is already in use' }, 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await db.insert(users).values({ username: cleanedUsername, slug, email, password: passwordHash });

    return c.json({ message: 'created user' }, 201);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

authRoutes.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'missing required fields: email, password' }, 400);
    }

    // by keeping this as a const it eliminates the possibility
    // of mismatch, giving the user potential info on whether it was
    // the email or password that was wrong specifically
    const credentialError = c.json({ error: 'invalid credentials' }, 401);

    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (user.length == 0) {
      return credentialError;
    }

    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) {
      return credentialError;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ id: user[0].id, username: user[0].username, email: user[0].email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    setCookie(c, 'rizuToken', token, {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7
    });

    return c.json({
      message: 'logged in!',
      user: { id: user[0].id, username: user[0].username, slug: user[0].slug }
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

authRoutes.get('/me', async (c) => {
  try {
    const token = getCookie(c, 'rizuToken');

    if (!token) {
      return c.json({ user: null }, 200);
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const userId = payload.id as string;
    if (!userId) return c.json({ user: null }, 200);

    const user = await db.select({
      id: users.id,
      username: users.username,
      slug: users.slug,
      avatar: users.avatar
    }).from(users).where(eq(users.id, userId)).limit(1);

    if (user.length == 0) {
      return c.json({ user: null }, 200);
    }

    return c.json({ user: user[0] });
  } catch (error) {
    return c.json({ user: null }, 200);
  }
});