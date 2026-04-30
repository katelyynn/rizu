import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text('username').notNull().unique(),
  slug: text('slug').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  born: timestamp('born').defaultNow().notNull(),
  about: text('about'),
  avatar: text('avatar')
});

export const friendships = pgTable('friendships', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  user: text('user').notNull().references(() => users.id),
  friend: text('friend').notNull().references(() => users.id),
  established: timestamp('sent').defaultNow().notNull()
});

export const friendRequests = pgTable('friend_requests', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  sender: text('sender').notNull().references(() => users.id),
  receiver: text('receiver').notNull().references(() => users.id),
  sent: timestamp('sent').defaultNow().notNull()
});

export const artists = pgTable('artists', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  mbid: text('mbid')
});

export const albums = pgTable('albums', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  artist: text('artist').references(() => artists.id),
  mbid: text('mbid')
});

export const songs = pgTable('songs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  artist: text('artist').notNull().references(() => artists.id),
  album: text('album').references(() => albums.id),
  duration: integer('duration'),
  mbid: text('mbid')
});

export const listens = pgTable('listens', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  user: text('user').notNull().references(() => users.id),
  song: text('song').notNull().references(() => songs.id),
  album: text('album').references(() => albums.id),
  played: timestamp('played').defaultNow().notNull()
});

export const comments = pgTable('comments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  author: text('author').notNull().references(() => users.id),
  parent: text('parent').references(() => comments.id),
  content: text('content').notNull(),

  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),

  created: timestamp('created').defaultNow().notNull()
});

export const activities = pgTable('activities', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  user: text('user').notNull().references(() => users.id),
  type: text('type').notNull(),

  target: text('target'),
  metadata: text('metadata'),
  created: timestamp('created').defaultNow().notNull(),

  count: integer('count').default(1).notNull(),
  artists: text('artists').array().default([]).notNull()
});