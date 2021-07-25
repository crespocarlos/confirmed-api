import { FastifyInstance } from 'fastify'
import { dbConnectorPlugin } from './plugin/dbConnector'

export const registerDb = (fastify: FastifyInstance) => {
  fastify.register(dbConnectorPlugin, {
    user: process.env.USERNAME ?? 'postgres',
    password: process.env.PASSWORD ?? 'postgres',
    host: 'localhost',
    port: 5432,
    database: process.env.DATABASE ?? 'confirmed',
  })
}
