import { FastifyInstance, RequestGenericInterface } from 'fastify'
import { ReservationStatus } from '../reservation/reservationSchema'
import { registerValidationSchemas } from './productSchema'

interface BaseProductRequest extends RequestGenericInterface {
  Params: {
    id: string
  }
}

interface ProductStockPatchRequest extends BaseProductRequest {
  Body: {
    stock: number
  }
}

interface ProductReservationPostRequest extends BaseProductRequest {
  Body: {
    reservationToken: string
  }
}

export const registerRoutes = (server: FastifyInstance) => {
  registerValidationSchemas(server)

  server.get<BaseProductRequest>(
    '/product/:id',
    {
      schema: {
        params: { $ref: 'params#' },
      },
    },
    async (req, reply) => {
      const productService = req.diScope.cradle.productService
      const stockLevel = await productService.getProductStockLevel(req.params.id)
      reply.send(stockLevel)
    }
  )

  server.patch<ProductStockPatchRequest>(
    '/product/:id/stock',
    {
      schema: {
        params: { $ref: 'params#' },
        body: { $ref: 'stock#' },
      },
    },
    async (req, reply) => {
      const productService = req.diScope.cradle.productService
      await productService.createOrUpdateStock(req.params.id, req.body.stock)
      reply.send()
    }
  )

  server.post<BaseProductRequest>(
    '/product/:id/reserve',
    {
      schema: {
        params: { $ref: 'params#' },
      },
    },
    async (req, reply) => {
      const reservationService = req.diScope.cradle.reservationService
      const reservation = await reservationService.reserve(req.params.id)
      reply.send(reservation)
    }
  )

  server.post<ProductReservationPostRequest>(
    '/product/:id/unreserve',
    {
      schema: {
        params: { $ref: 'params#' },
        body: { $ref: 'reservationToken#' },
      },
    },
    async (req, reply) => {
      const reservationService = req.diScope.cradle.reservationService
      await reservationService.updateReservationStatus(
        req.params.id,
        req.body.reservationToken,
        ReservationStatus.ACTIVE,
        ReservationStatus.CANCELED
      )
      reply.send()
    }
  )

  server.post<ProductReservationPostRequest>(
    '/product/:id/sold',
    {
      schema: {
        params: { $ref: 'params#' },
        body: { $ref: 'reservationToken#' },
      },
    },
    async (req, reply) => {
      const reservationService = req.diScope.cradle.reservationService
      await reservationService.updateReservationStatus(
        req.params.id,
        req.body.reservationToken,
        ReservationStatus.ACTIVE,
        ReservationStatus.SOLD
      )
      reply.send()
    }
  )
}
