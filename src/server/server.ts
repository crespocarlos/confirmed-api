import fastify from 'fastify'
import { registerDependencies } from './diConfig'
import { registerRoutes } from './routes'
import { fastifyAwilixPlugin, diContainer } from 'fastify-awilix'
import { registerDb } from './db'

const start = async () => {
  const app = fastify({ logger: true })
  app.register(fastifyAwilixPlugin, { disposeOnClose: true, disposeOnResponse: false })

  registerDb(app)
  registerRoutes(app)
  registerDependencies(app, diContainer)

  app.setErrorHandler(function (error, request, reply) {
    console.warn(error) // Here it logs the custom error object correctly.
    reply.send(error)
  })

  try {
    await app.listen(3000)
  } catch (err) {
    app.log.error(err)
  }
}

start()
