import { Client } from 'pg'
import { Dependencies } from '../../server/diConfig'
import { ReservationRow, ReservationStatus } from './reservationSchema'

export class ReservationRepository {
  private readonly db: Client

  constructor({ db }: Dependencies) {
    this.db = db
  }

  async reserveProduct(productId: number, uuid: string) {
    const { rows } = await this.db.query<ReservationRow>(
      `INSERT INTO reservation(
        token,
        status,
        product_id
      )
      values (
        $1,
        $2,
        $3
      )
      RETURNING *`,
      [uuid, ReservationStatus.ACTIVE, productId]
    )

    return rows[0]
  }

  async updateReservationStatus(productId: number, token: string, from: ReservationStatus, to: ReservationStatus) {
    const { rowCount } = await this.db.query(
      `UPDATE reservation SET status = $1 WHERE token = $2 AND status = $3 AND product_id = $4`,
      [to, token, from, productId]
    )

    return rowCount
  }
}
