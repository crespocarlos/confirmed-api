import { FastifyInstance } from 'fastify'
import { registerProductApiRoutes } from '../api/routes'

export const registerRoutes = (fastify: FastifyInstance) => {
  registerProductApiRoutes(fastify)
}
