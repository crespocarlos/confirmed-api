import { FastifyInstance } from 'fastify'

export type ProductRow = {
  id: number
  sku: string
  created_at: Date
}

export type ProductStockLevelRow = {
  in_stock: number
  reserved: number
  sold: number
}

export type ProductStockLevelDto = {
  IN_STOCK: number
  RESERVED: number
  SOLD: number
}

export const mapProductStockLevelToDto = (productStockLevel: ProductStockLevelRow): ProductStockLevelDto => ({
  IN_STOCK: productStockLevel.in_stock,
  RESERVED: productStockLevel.reserved,
  SOLD: productStockLevel.sold,
})

export const registerValidationSchemas = (fastify: FastifyInstance) => {
  fastify.addSchema({
    $id: 'params',
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 5 },
    },
  })

  fastify.addSchema({
    $id: 'stock',
    type: 'object',
    properties: {
      stock: { type: 'number', minimum: 0 },
    },
    required: ['stock'],
  })

  fastify.addSchema({
    $id: 'reservationToken',
    type: 'object',
    properties: {
      reservationToken: { type: 'string', minLength: 0 },
    },
    required: ['reservationToken'],
  })
}
