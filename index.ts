import fastify from 'fastify';
import supabaseClient from './supabase/client';
import cors from '@fastify/cors';
import masterRoute from './routes/master';
import proxyRoute from './routes/proxy';
import env from './env';

(async () => {
  const server = fastify();
  const supabase = supabaseClient();
  server.register(cors, {
    origin: (origin, cb) => {
      const allowedOrigins = ['http://localhost:3000', env.DASHBOARD_DOMAIN];
      // Allow requests with no origin (e.g., mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  server.decorateRequest('supabase', {
    getter: () => supabase,
  });
  server.register(masterRoute, { prefix: 'master' });
  server.register(proxyRoute, { prefix: 'api' });
  server.get('/ping', async (request, reply) => {
    await request.supabase.from('groups').select('id').limit(1);
    return 'pong\n';
  });

  server.listen({ port: +env.PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
})();
