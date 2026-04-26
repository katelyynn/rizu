import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authRoutes } from './routes/auth';

const app = new Hono();

app.use('*', cors());

app.route('/api/auth', authRoutes);

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