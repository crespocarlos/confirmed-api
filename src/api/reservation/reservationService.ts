import { Client } from 'pg'
import { Dependencies } from '../../server/diConfig'
import { ProductRespository } from '../product/productRepository'
import { ErrorResponse } from '../shared/errors'
import { ReservationRepository } from './reservationRepository'
import { v4 as uuidv4 } from 'uuid'
import { mapReservationToDto, ReservationStatus } from './reservationSchema'
import { StockRespository } from '../stock/stockRepository'

export class ReservationService {
  private readonly productRespository: ProductRespository
  private readonly reservationRepository: ReservationRepository
  private readonly stockRepository: StockRespository
  private readonly db: Client

  constructor({ productRespository, reservationRepository, stockRepository, db }: Dependencies) {
    this.productRespository = productRespository
    this.reservationRepository = reservationRepository
    this.stockRepository = stockRepository
    this.db = db
  }

  async reserve(sku: string) {
    const product = await this.productRespository.getProductBySku(sku)
    if (!product) {
      throw new ErrorResponse(404, 'product not found')
    }

    try {
      this.db.query('BEGIN')
      const reservation = await this.reservationRepository.reserveProduct(product.id, uuidv4())
      const stockLevel = await this.productRespository.getProductStockLevel(sku)

      console.log('STOCK_LEVEL', product.id, sku, stockLevel.in_stock, stockLevel.reserved + stockLevel.sold)
      if (stockLevel.in_stock <= 0) {
        throw new ErrorResponse(400, 'unable to reserve product')
      }

      this.stockRepository.updateStock(product.id, stockLevel.in_stock - 1)

      await this.db.query('COMMIT')
      return mapReservationToDto(reservation)
    } catch (e) {
      this.db.query('ROLLBACK')
      throw e
    }
  }

  async updateReservationStatus(sku: string, token: string, from: ReservationStatus, to: ReservationStatus) {
    const product = await this.productRespository.getProductBySku(sku)
    if (!product) {
      throw new ErrorResponse(404, 'product not found')
    }

    try {
      this.db.query('BEGIN')
      const rowCount = await this.reservationRepository.updateReservationStatus(product.id, token, from, to)
      if (rowCount === 0) {
        throw new ErrorResponse(400, 'unable to update reservation status')
      }

      if (to === ReservationStatus.CANCELED) {
        const stockLevel = await this.productRespository.getProductStockLevel(sku)
        this.stockRepository.updateStock(product.id, stockLevel.in_stock + 1)
      }

      await this.db.query('COMMIT')
    } catch (e) {
      this.db.query('ROLLBACK')
      throw e
    }
  }
}
