import { Hono } from 'hono';
import { db } from '../db';
import { activities, albums, artists, listens, songs } from '../db/schema';
import { and, eq, gte, sql } from 'drizzle-orm';
import { getCookie } from 'hono/cookie';
import { jwtVerify } from 'jose';

export const listenRoutes = new Hono();

async function findOrCreateArtist(name: string) {
  const artist = await db.select().from(artists).where(eq(artists.name, name)).limit(1);
  if (artist.length > 0) return artist[0];

  const newArtist = await db.insert(artists).values({ name }).returning();
  return newArtist[0];
}

async function findOrCreateAlbum(name: string, artist: string) {
  const album = await db.select().from(albums).where(eq(albums.name, name)).limit(1);
  if (album.length > 0) return album[0];

  const newAlbum = await db.insert(albums).values({ name, artist }).returning();
  return newAlbum[0];
}

async function findOrCreateSong(name: string, artist: string) {
  const song = await db.select().from(songs).where(eq(songs.name, name)).limit(1);
  if (song.length > 0) return song[0];

  const newSong = await db.insert(songs).values({ name, artist }).returning();
  return newSong[0];
}

listenRoutes.post('/', async (c) => {
  try {
    const token = getCookie(c, 'rizuToken');
    if (!token) return c.json({ error: 'unauthorised' }, 401);

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const userId = payload.id as string;
    if (!userId) {
      return c.json({ error: 'invalid token' }, 401);
    }

    const {
      songName,
      artistName,
      albumName,
      albumArtistName,
      duration,
      timestamp
    } = await c.req.json();

    if (!songName || !artistName) {
      return c.json({ error: 'missing required fields: name, artist' }, 400);
    }

    const finalAlbumArtistName = albumArtistName || artistName;

    const artist = await findOrCreateArtist(artistName);

    let album = null;
    if (albumName) {
      const albumArtist = await findOrCreateArtist(finalAlbumArtistName);
      album = await findOrCreateAlbum(albumName, albumArtist.id);
    }

    const song = await findOrCreateSong(songName, artist.id);

    const playedAt = timestamp ? new Date(timestamp) : new Date();

    await db.insert(listens).values({
      user: userId,
      song: song.id,
      album: album?.id,
      duration,
      played: playedAt
    });

    const timeLimit = new Date(Date.now() - 3 * (60 * 60 * 1000));

    const recentListen = await db
      .select({ id: activities.id })
      .from(activities)
      .where(
        and(
          eq(activities.user, userId),
          eq(activities.type, 'listen'),
          gte(activities.created, timeLimit)
        )
      ).limit(1);

    if (recentListen.length > 0) {
      // update recent activity
      await db
        .update(activities)
        .set({
          target: song.id,
          count: sql`${activities.count} + 1`,
          artists: sql`array_append(array_remove(${activities.artists}, ${artistName}), ${artistName})`,
          created: new Date()
        })
        .where(eq(activities.id, recentListen[0].id));
    } else {
      // fresh activity
      await db.insert(activities).values({
        user: userId,
        type: 'listen',
        target: song.id,
        count: 1,
        artists: [ artistName ]
      });
    }

    return c.json({ message: 'added listen to journal', song: song.id }, 201);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});