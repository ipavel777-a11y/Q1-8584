import { Hono } from 'hono';
import { cors } from "hono/cors";
import autoUpdateRouter from './routes/auto-update';

type Env = {
  DB: D1Database;
  AI_GATEWAY_API_KEY: string;
  BETTER_AUTH_SECRET: string;
};

const app = new Hono<{ Bindings: Env }>()
  .basePath('api');

app.use(cors({
  origin: "*"
}));

app.get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }));

// Auto-update routes: /api/auto-update/trigger, /api/auto-update/status
app.route('/auto-update', autoUpdateRouter);

export default app;
