
export interface UserLoginRequest {
  taiKhoan: string
  matKhau: string
}
export interface CurrentUser {
  id: string
  name: string
  email: string
  phoneNumber: string
  accessToken: string
  avatar: string
}
export interface EditUser {
  email: string
  id: string
  name: string
  phoneNumber: string
}

export interface UserRegisterRequest {
  email: string
  password: string
  name: string
  phoneNumber: string
}
