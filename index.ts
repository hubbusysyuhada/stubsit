import fastify from 'fastify'
import supabaseClient from './supabase/client'
import masterRoute from './routes/master'
import proxyRoute from './routes/proxy'

(async () => {
  const server = fastify()
  const supabase = supabaseClient()
  server.decorateRequest('supabase', {
    getter:() => supabase,
  })
  server.register(masterRoute, {prefix: 'master'})
  server.register(proxyRoute, {prefix: 'api'})
  server.listen({ port: 3000 }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
})()