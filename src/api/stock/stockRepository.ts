import { Client } from 'pg'
import { Dependencies } from '../../server/diConfig'

export class StockRespository {
  private readonly db: Client

  constructor({ db }: Dependencies) {
    this.db = db
  }

  async updateStock(sku: number, quantity: number) {
    return this.db.query('UPDATE stock SET stock=$1 WHERE product_id=$2', [quantity, sku])
  }

  async createStock(sku: number, quantity: number) {
    return this.db.query('INSERT INTO stock(stock, product_id) values ($1, $2)', [quantity, sku])
  }
}
