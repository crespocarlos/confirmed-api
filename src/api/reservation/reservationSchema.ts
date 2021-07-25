export type ReservationRow = {
  id: number
  token: string
  status: ReservationStatus
  product_id: number
  created_at: Date
}

export enum ReservationStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  SOLD = 'sold',
}

export type ReservationDto = {
  reservationToken: string
}

export const mapReservationToDto = (reservation: ReservationRow): ReservationDto => ({
  reservationToken: reservation.token,
})
