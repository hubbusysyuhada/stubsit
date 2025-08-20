import fastify from 'fastify'
import supabaseClient from './supabase/client'
import cors from '@fastify/cors'
import masterRoute from './routes/master'
import proxyRoute from './routes/proxy'
import env from './env'
import fastifyStatic from '@fastify/static'
import path from 'path'
import { readdirSync } from 'fs'

(async () => {
  const server = fastify()
  const supabase = supabaseClient()
  server.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = [
      'http://localhost:3000',
      env.DOMAIN,
    ]
    // Allow requests with no origin (e.g., mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true)
    } else {
      cb(new Error("Not allowed by CORS"), false)
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
})
  server.decorateRequest('supabase', {
    getter:() => supabase,
  })
  server.register(fastifyStatic, {
    root: path.resolve(__dirname, 'out'),
  })
  server.register(masterRoute, {prefix: 'master'})
  server.register(proxyRoute, {prefix: 'api'})
  server.get('/debug-path', (request, reply) => {
    const root = path.resolve(__dirname, '..')
    const directories = readdirSync(root)
    const staticPath = path.resolve(__dirname, 'out');
    reply.send({ root, directories, staticPath });
  });
  server.get('/ping', async (request, reply) => {
    return 'pong\n'
  })
  
  server.listen({ port: +(env.PORT), host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
})()