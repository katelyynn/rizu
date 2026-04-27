import { Hono } from 'hono';
import { db } from '../db';
import { albums } from '../db/schema';
import { eq } from 'drizzle-orm';

export const albumRoutes = new Hono();

albumRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');

  const album = await db.select({
    id: albums.id,
    name: albums.name,
    artist: albums.artist
  }).from(albums).where(eq(albums.id, id)).limit(1);

  if (album.length == 0) {
    return c.json({ error: 'album not found' }, 404);
  }

  return c.json(album[0]);
});

albumRoutes.get('/', async (c) => {
  const allAlbums = await db.select({
    id: albums.id,
    name: albums.name,
    artist: albums.artist
  }).from(albums);

  return c.json(allAlbums);
});