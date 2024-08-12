export interface Welcome<T = any> {
  statusCode: number
  message: string
  content: T
  dateTime: Date
}
