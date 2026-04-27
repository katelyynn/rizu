import { Hono } from 'hono';
import { getAuthUser } from './auth';
import { db } from '../db';
import { friendRequests, friendships, users } from '../db/schema';
import { and, eq } from 'drizzle-orm';

export const friendRoutes = new Hono();

friendRoutes.post('/request/:slug', async (c) => {
  const userId = await getAuthUser(c);
  if (!userId) {
    return c.json({ error: 'unauthorised' }, 401);
  }

  const receiverSlug = c.req.param('slug');

  const receiverList = await db.select({ id: users.id }).from(users).where(eq(users.slug, receiverSlug)).limit(1);
  if (receiverList.length == 0) return c.json({ error: 'user not found' }, 404);

  const receiver = receiverList[0];

  if (userId == receiver.id) {
    return c.json({ error: 'you cannot befriend yourself this way' }, 400);
  }

  const existingRequest = await db.select().from(friendRequests).where(
    and(
      eq(friendRequests.sender, userId),
      eq(friendRequests.receiver, receiver.id)
    )
  ).limit(1);

  if (existingRequest.length > 0) {
    return c.json({ error: 'request already sent' }, 409);
  }

  await db.insert(friendRequests).values({ sender: userId, receiver: receiver.id });
  return c.json({ message: 'sent friend request' }, 201);
});

friendRoutes.post('/accept/:id', async (c) => {
  const userId = await getAuthUser(c);
  if (!userId) {
    return c.json({ error: 'unauthorised' }, 401);
  }

  const id = c.req.param('id');

  // dont allow people to see friend requests they cant access
  // based on the error sent being different
  const notFound = c.json({ error: 'request not found' }, 404);

  const requestList = await db.select().from(friendRequests).where(eq(friendRequests.id, id)).limit(1);

  if (requestList.length == 0) return notFound;

  const request = requestList[0];

  if (request.receiver != userId) return notFound;

  await db.insert(friendships).values([
    { user: userId, friend: request.sender },
    { user: request.sender, friend: userId }
  ]);

  await db.delete(friendRequests).where(eq(friendRequests.id, request.id));

  return c.json({ message: 'accepted friend request' }, 200);
});