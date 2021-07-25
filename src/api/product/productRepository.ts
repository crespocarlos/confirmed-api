import { Client } from 'pg'
import { Dependencies } from 'src/server/diConfig'
import { ProductRow, ProductStockLevelRow } from './productSchema'

const formatSku = (sku: string) => sku.toUpperCase().trim()

export class ProductRespository {
  private readonly db: Client

  constructor({ db }: Dependencies) {
    this.db = db
  }

  async getProductBySku(sku: string) {
    const { rows } = await this.db.query<ProductRow>('SELECT * FROM product WHERE sku=$1', [formatSku(sku)])
    return rows[0]
  }

  async createProduct(sku: string) {
    const { rows } = await this.db.query<ProductRow>(
      'INSERT INTO product(sku) values ($1) RETURNING id, sku, created_at',
      [formatSku(sku)]
    )
    return rows[0]
  }

  async getProductStockLevel(sku: string) {
    const { rows } = await this.db.query<ProductStockLevelRow>(
      `
      SELECT
        stock.stock in_stock,
        COALESCE(reserved.count, 0)::INTEGER reserved,
        COALESCE(sold.count, 0)::INTEGER sold
      FROM product
      INNER JOIN stock
        on stock.product_id = product.id
      LEFT JOIN (
        SELECT reservation.product_id,
          count(reservation.product_id) count
        FROM reservation
        WHERE reservation.status = 'active'
        GROUP BY reservation.product_id
      ) as reserved
        ON reserved.product_id = product.id
      LEFT JOIN (
        SELECT reservation.product_id,
          count(reservation.product_id) count
        FROM reservation
        WHERE reservation.status = 'sold'
        GROUP BY reservation.product_id
      ) as sold
        ON sold.product_id = product.id
      WHERE sku=$1
      GROUP BY stock.stock, reserved.count, sold.count`,
      [formatSku(sku)]
    )

    return rows[0]
  }
}
