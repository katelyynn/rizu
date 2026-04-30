import { Hono } from 'hono';
import { activities, comments, users } from '../db/schema';
import { db } from '../db';
import { desc, eq, inArray } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export const activitiesRoutes = new Hono();

activitiesRoutes.get('/:slug', async (c) => {
  const slug = c.req.param('slug');

  const user = await db.select({ id: users.id, username: users.username, slug: users.slug, avatar: users.avatar }).from(users).where(eq(users.slug, slug)).limit(1);
  if (user.length == 0) return c.json({ error: 'user not found' }, 404);

  const userId = user[0].id;

  const userActivity = await db
    .select({
      id: activities.id,
      type: activities.type,
      target: activities.target,
      created: activities.created
    })
    .from(activities)
    .where(eq(activities.user, userId))
    .orderBy(desc(activities.created)).limit(20);

  // comments
  const commentTargets = userActivity
    .filter(a => a.type == 'comment' && a.target)
    .map(a => a.target!);

  let commentMap: Record<string, any> = {};

  if (commentTargets.length > 0) {
    const commentData = await db
      .select({
        id: comments.id,
        content: comments.content,
        created: comments.created,
        targetType: comments.targetType,
        targetId: comments.targetId
      })
      .from(comments)
      .where(inArray(comments.id, commentTargets));

    const profileComments = commentData
      .filter(c => c.targetType == 'user')
      .map(c => c.targetId);

    let profileUserMap: Record<string, { id: string, username: string, slug: string, avatar?: string }> = {};

    if (profileComments.length > 0) {
      const profileUsers = await db
        .select({
          id: users.id,
          username: users.username,
          slug: users.slug,
          avatar: users.avatar
        })
        .from(users)
        .where(inArray(users.id, profileComments));

      profileUserMap = Object.fromEntries(
        profileUsers.map(u => [ u.id, u ])
      );
    }

    commentMap = Object.fromEntries(
      commentData.map(comment => {
        let location = null;

        if (comment.targetType == 'user' && profileUserMap[comment.targetId]) {
          location = profileUserMap[comment.targetId];
        }

        return [
          comment.id,
          {
            ...comment,
            location
          }
        ]
      })
    );
  }

  const formatted = userActivity.map(activity => {
    if (activity.type == 'comment' && activity.target && commentMap[activity.target]) {
      return {
        ...activity,
        comment: commentMap[activity.target],
        user: user[0]
      };
    }

    return activity;
  });

  return c.json(formatted);
});