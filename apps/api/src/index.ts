import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';

const app = new Hono({ strict: false });

app.use('*', cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

app.route('/api/auth', authRoutes);
app.route('/api/user', userRoutes);

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