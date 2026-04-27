import { Hono } from 'hono';
import { db } from '../db';
import { songs } from '../db/schema';
import { eq } from 'drizzle-orm';

export const songRoutes = new Hono();

songRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');

  const song = await db.select({
    id: songs.id,
    name: songs.name,
    artist: songs.artist
  }).from(songs).where(eq(songs.id, id)).limit(1);

  if (song.length == 0) {
    return c.json({ error: 'song not found' }, 404);
  }

  return c.json(song[0]);
});

songRoutes.get('/', async (c) => {
  const allSongs = await db.select({
    id: songs.id,
    name: songs.name,
    artist: songs.artist
  }).from(songs);

  return c.json(allSongs);
});