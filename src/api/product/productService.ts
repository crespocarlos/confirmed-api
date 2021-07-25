import { Client } from 'pg'
import { Dependencies } from '../../server/diConfig'
import { ErrorResponse } from '../shared/errors'
import { StockRespository } from '../stock/stockRepository'
import { ProductRespository } from './productRepository'
import { mapProductStockLevelToDto } from './productSchema'

export class ProductService {
  private readonly productRespository: ProductRespository
  private readonly stockRepository: StockRespository
  private readonly db: Client

  constructor({ productRespository, stockRepository, db }: Dependencies) {
    this.productRespository = productRespository
    this.stockRepository = stockRepository
    this.db = db
  }

  async createOrUpdateStock(sku: string, quantity: number) {
    const product = await this.productRespository.getProductBySku(sku)

    if (!product) {
      try {
        this.db.query('BEGIN')
        const newProduct = await this.productRespository.createProduct(sku)
        await this.stockRepository.createStock(newProduct.id, quantity)
        this.db.query('COMMIT')
      } catch (e) {
        await this.db.query('ROLLBACK')
        throw e
      }
    } else {
      await this.stockRepository.updateStock(product.id, quantity)
    }
  }

  async getProductStockLevel(sku: string) {
    const stockLevel = await this.productRespository.getProductStockLevel(sku)
    if (!stockLevel) {
      throw new ErrorResponse(404, 'product not found')
    }

    return mapProductStockLevelToDto(stockLevel)
  }
}
