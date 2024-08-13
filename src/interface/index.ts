export interface ApiWelcome<T = any> {
    statusCode: number;
    message: string;
    content: T;
    dateTime: Date;
    messageConstants: null;
  }