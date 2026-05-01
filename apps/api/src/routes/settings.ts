import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { jwtVerify } from 'jose';
import { db } from '../db';
import { privacySettings, users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { getAuthUser } from './auth';

export const settingsRoutes = new Hono();

settingsRoutes.patch('/profile/avatar', async (c) => {
  try {
    const userId = await getAuthUser(c);
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

settingsRoutes.patch('/profile/pronouns', async (c) => {
  try {
    const userId = await getAuthUser(c);
    if (!userId) {
      return c.json({ error: 'invalid token' }, 401);
    }

    const { personal, possessive } = await c.req.json();

    if (!personal || !possessive) {
      return c.json({ error: 'missing required fields: personal, possessive' }, 400);
    }

    await db.update(users).set({
      personalPronoun: personal,
      possessivePronoun: possessive
    }).where(eq(users.id, userId));

    return c.json({ message: 'updated pronouns', pronouns: { personal, possessive } });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

settingsRoutes.get('/privacy', async (c) => {
  try {
    const userId = await getAuthUser(c);
    if (!userId) {
      return c.json({ error: 'invalid token' }, 401);
    }

    const settings = await db
      .select({
        presence: privacySettings.presence,
        activity: privacySettings.activity,
        listening: privacySettings.recentListening,
        library: privacySettings.library,
        show_comments: privacySettings.showComments,
        open_comments: privacySettings.openComments,
        messages: privacySettings.messages,
        friends: privacySettings.friends
      })
      .from(privacySettings)
      .where(eq(privacySettings.user, userId));

    if (settings.length > 0) {
      return c.json(settings[0]);
    }

    const [ newSettings ] = await db
      .insert(privacySettings)
      .values({ user: userId })
      .returning();

    return c.json({
      presence: newSettings.presence,
      activity: newSettings.activity,
      listening: newSettings.recentListening,
      library: newSettings.library,
      show_comments: newSettings.showComments,
      open_comments: newSettings.openComments,
      messages: newSettings.messages,
      friends: newSettings.friends
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

settingsRoutes.patch('/privacy', async (c) => {
  try {
    const userId = await getAuthUser(c);
    if (!userId) {
      return c.json({ error: 'invalid token' }, 401);
    }

    const {
      presence,
      activity,
      recentListening,
      library,
      showComments,
      openComments,
      messages,
      friends
    } = await c.req.json();

    if (!presence || !activity || !recentListening || !library || !showComments || !openComments || !messages || !friends) {
      return c.json({ error: 'missing required fields: presence, activity, recentListening, library, showComments, openComments, messages, friends' }, 400);
    }

    await db.update(privacySettings).set({
      presence,
      activity,
      recentListening,
      library,
      showComments,
      openComments,
      messages,
      friends
    }).where(eq(privacySettings.user, userId));

    return c.json({ message: 'updated privacy settings' });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});