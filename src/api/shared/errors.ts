export class ErrorResponse extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.name = 'ErrorResponse'
    this.statusCode = statusCode
  }
}
