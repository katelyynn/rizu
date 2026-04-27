import { Hono } from 'hono';
import { db } from '../db';
import { artists } from '../db/schema';
import { eq } from 'drizzle-orm';

export const artistRoutes = new Hono();

artistRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');

  const artist = await db.select({
    id: artists.id,
    name: artists.name
  }).from(artists).where(eq(artists.id, id)).limit(1);

  if (artist.length == 0) {
    return c.json({ error: 'artist not found' }, 404);
  }

  return c.json(artist[0]);
});

artistRoutes.get('/', async (c) => {
  const allArtists = await db.select({
    id: artists.id,
    name: artists.name
  }).from(artists);

  return c.json(allArtists);
});