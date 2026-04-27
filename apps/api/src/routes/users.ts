import { Hono } from 'hono';
import { db } from '../db';
import { albums, artists, listens, songs, users } from '../db/schema';
import { desc, eq } from 'drizzle-orm';

export const userRoutes = new Hono();

userRoutes.get('/:slug', async (c) => {
  const slug = c.req.param('slug');

  const user = await db.select({
    id: users.id,
    username: users.username,
    slug: users.slug,
    born: users.born,
    avatar: users.avatar
  }).from(users).where(eq(users.slug, slug)).limit(1);

  if (user.length == 0) {
    return c.json({ error: 'user not found' }, 404);
  }

  return c.json(user[0]);
});

userRoutes.get('/:slug/recent', async (c) => {
  const slug = c.req.param('slug');

  const user = await db.select({
    id: users.id
  }).from(users).where(eq(users.slug, slug)).limit(1);

  if (user.length == 0) {
    return c.json({ error: 'user not found' }, 404);
  }

  const recentListens = await db
    .select({
      listen: listens,
      song: songs,
      artist: artists,
      album: albums
    })
    .from(listens)
    .innerJoin(songs, eq(listens.song, songs.id))
    .innerJoin(artists, eq(songs.artist, artists.id))
    .innerJoin(albums, eq(listens.album, albums.id))
    .where(eq(listens.user, user[0].id))
    .orderBy(desc(listens.played))
    .limit(10);

  return c.json(recentListens);
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