import fp from 'fastify-plugin'
import {
  FastifyInstance,
  FastifyLoggerInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
} from 'fastify'
import { Client, ClientConfig } from 'pg'

const dbConnector = async (fastify: FastifyInstance, config: ClientConfig) => {
  const client = new Client(config)

  try {
    await client.connect()
    console.log('db connected succesfully')
    fastify.decorate('db', client)
  } catch (err) {
    console.error(err)
  }
}
export const dbConnectorPlugin = fp(dbConnector, {
  fastify: '3.x',
  name: 'db-connector',
})

declare module 'fastify' {
  export interface FastifyInstance<
    RawServer extends RawServerBase = RawServerDefault,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Logger = FastifyLoggerInstance
  > {
    db: Client
  }
}
