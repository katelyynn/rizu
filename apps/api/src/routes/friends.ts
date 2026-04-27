import { Hono } from 'hono';
import { getAuthUser } from './auth';
import { db } from '../db';
import { albums, artists, friendRequests, friendships, listens, songs, users } from '../db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';

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

friendRoutes.get('/incoming', async (c) => {
  const userId = await getAuthUser(c);
  if (!userId) {
    return c.json({ error: 'unauthorised' }, 401);
  }

  const requests = await db
    .select({
      id: friendRequests.id,
      sender: users
    })
    .from(friendRequests)
    .innerJoin(users, eq(friendRequests.sender, users.id))
    .where(eq(friendRequests.receiver, userId));

  return c.json(requests);
});

friendRoutes.get('/outgoing', async (c) => {
  const userId = await getAuthUser(c);
  if (!userId) {
    return c.json({ error: 'unauthorised' }, 401);
  }

  const requests = await db
    .select({
      id: friendRequests.id,
      receiver: users
    })
    .from(friendRequests)
    .innerJoin(users, eq(friendRequests.receiver, users.id))
    .where(eq(friendRequests.sender, userId));

  return c.json(requests);
});

friendRoutes.get('/list', async (c) => {
  const userId = await getAuthUser(c);
  if (!userId) {
    return c.json({ error: 'unauthorised' }, 401);
  }

  const latestListens = db
    .select({
      user: listens.user,
      listen: sql<string>`MAX(${listens.id})`.as('latest_listen_id')
    })
    .from(listens)
    .groupBy(listens.user)
    .as('latest_listens');

  const friends = await db
    .select({
      friend: users,
      listen: listens,
      song: songs,
      artist: artists,
      album: albums
    })
    .from(friendships)
    .innerJoin(users, eq(friendships.friend, users.id))
    .leftJoin(latestListens, eq(users.id, latestListens.user))
    .leftJoin(listens, eq(listens.id, latestListens.listen))
    .leftJoin(songs, eq(listens.song, songs.id))
    .leftJoin(artists, eq(songs.artist, songs.artist))
    .leftJoin(albums, eq(listens.album, albums.id))
    .where(eq(friendships.user, userId))
    .orderBy(desc(listens.played));

  return c.json(friends);
});

friendRoutes.get('/status/:slug', async (c) => {
  const userId = await getAuthUser(c);
  if (!userId) {
    return c.json({ error: 'unauthorised' }, 401);
  }

  const slug = c.req.param('slug');

  const target = await db.select({ id: users.id }).from(users).where(eq(users.slug, slug)).limit(1);
  if (target.length == 0) return c.json({ error: 'user not found' }, 404);

  const targetId = target[0].id;

  if (userId == targetId) return c.json({ error: 'this is you' }, 200);

  const isFriend = await db.select().from(friendships).where(
    and(
      eq(friendships.user, userId),
      eq(friendships.friend, targetId)
    )
  ).limit(1);
  if (isFriend.length > 0) return c.json({ status: 'friends' }, 200);

  const sentRequest = await db.select().from(friendRequests).where(
    and(
      eq(friendRequests.sender, userId),
      eq(friendRequests.receiver, targetId)
    )
  ).limit(1);
  if (sentRequest.length > 0) return c.json({ status: 'outgoing' }, 200);

  const receivedRequest = await db.select().from(friendRequests).where(
    and(
      eq(friendRequests.sender, targetId),
      eq(friendRequests.receiver, userId)
    )
  ).limit(1);
  if (receivedRequest.length > 0) return c.json({ status: 'incoming' }, 200);

  return c.json({ status: 'none' }, 200);
});