export interface UserLoginRequest {
  email: string
  password: string
}

export interface UserRegisterRequest {
  email: string
  password: string
  name: string
  phoneNumber: string
}
export interface CurrentUser {
  id: number
  email: string
  avatar: string
  phoneNumber: string
  name: string
  accessToken: string
}
