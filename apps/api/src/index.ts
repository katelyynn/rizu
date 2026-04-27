import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { artistRoutes } from './routes/artists';
import { albumRoutes } from './routes/albums';
import { songRoutes } from './routes/songs';
import { listenRoutes } from './routes/listens';
import { settingsRoutes } from './routes/settings';

const app = new Hono({ strict: false });

app.use('*', cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

app.route('/api/auth', authRoutes);
app.route('/api/user', userRoutes);
app.route('/api/artist', artistRoutes);
app.route('/api/album', albumRoutes);
app.route('/api/song', songRoutes);
app.route('/api/listen', listenRoutes);
app.route('/api/settings', settingsRoutes);

app.get('/api/tracks', (c) => {
  const tracks = [
    {
      "name": "test"
    }
  ];
  return c.json(tracks);
});

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`running on: http://localhost:${info.port}`);
});