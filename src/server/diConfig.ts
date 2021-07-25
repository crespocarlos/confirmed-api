import { AwilixContainer, BuildResolver, DisposableResolver } from 'awilix'

import { ProductService } from '../api/product/productService'
import { ProductRespository } from '../api/product/productRepository'
import { StockRespository } from '../api/stock/stockRepository'

import { asClass, asFunction, Lifetime } from 'awilix'
import { FastifyInstance } from 'fastify'
import { Client } from 'pg'
import { ReservationRepository } from '../api/reservation/reservationRepository'
import { ReservationService } from '../api/reservation/reservationService'

export const registerDependencies = (fastify: FastifyInstance, diContainer: AwilixContainer) => {
  const diConfig: DiConfig = {
    db: asFunction(() => fastify.db, {
      lifetime: Lifetime.SINGLETON,
      dispose: (module: Client) => {
        module.end()
      },
    }),
    productService: asClass(ProductService, {
      lifetime: Lifetime.SINGLETON,
    }),
    productRespository: asClass(ProductRespository, {
      lifetime: Lifetime.SINGLETON,
    }),
    stockRepository: asClass(StockRespository, {
      lifetime: Lifetime.SINGLETON,
    }),
    reservationService: asClass(ReservationService, {
      lifetime: Lifetime.SINGLETON,
    }),
    reservationRepository: asClass(ReservationRepository, {
      lifetime: Lifetime.SINGLETON,
    }),
  }

  diContainer.register(diConfig)
}

type DiConfig = DiConfigMapper<Dependencies>

type DiConfigMapper<Type> = {
  [Property in keyof Type]: BuildResolver<Type[Property]> & DisposableResolver<Type[Property]>
}

export interface Dependencies {
  db: Client
  productService: ProductService
  productRespository: ProductRespository
  stockRepository: StockRespository
  reservationService: ReservationService
  reservationRepository: ReservationRepository
}

declare module 'fastify-awilix' {
  interface Cradle extends Dependencies {}
  interface RequestCradle extends Dependencies {}
}
