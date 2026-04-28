import { Hono } from 'hono';
import { getAuthUser } from './auth';
import { db } from '../db';
import { activities, comments, users } from '../db/schema';
import { and, desc, eq } from 'drizzle-orm';

export const commentRoutes = new Hono();

commentRoutes.post('/', async (c) => {
  const userId = await getAuthUser(c);
  if (!userId) {
    return c.json({ error: 'unauthorised' }, 401);
  }

  const { content, parent, type, id } = await c.req.json();

  if (!content || !type || !id) {
    return c.json({ error: 'missing required fields: content, type, id' }, 400);
  }

  let exists = false;
  if (type == 'user') exists = (await db.select().from(users).where(eq(users.id, id)).limit(1)).length > 0;

  const notFoundError = c.json({ error: 'target not found' }, 404);

  if (!exists) {
    return notFoundError;
  }

  if (parent) {
    const parentComment = await db.select().from(comments).where(eq(comments.id, parent)).limit(1);
    if (parentComment.length == 0 || parentComment[0].targetId != id) {
      return notFoundError;
    }
  }

  const [newComment] = await db.insert(comments).values({
    author: userId,
    parent: parent || null,
    content: content.trim(),
    targetType: type,
    targetId: id
  }).returning();

  await db.insert(activities).values({
    user: userId,
    type: 'comment',
    target: newComment.id
  });

  return c.json({ message: 'posted comment', id: newComment.id }, 201);
});

commentRoutes.get('/:type/:id', async (c) => {
  const { type, id } = c.req.param();

  const valid = [ 'user' ];
  if (!valid.includes(type)) {
    return c.json({ error: 'invalid type' }, 400);
  }

  const allComments = await db
    .select({
      id: comments.id,
      content: comments.content,
      created: comments.created,
      parent: comments.parent,
      author: users
    })
    .from(comments)
    .innerJoin(users, eq(comments.author, users.id))
    .where(and(
      eq(comments.targetType, type),
      eq(comments.targetId, id)
    ))
    .orderBy(desc(comments.created));

  return c.json(allComments);
});