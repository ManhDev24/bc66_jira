export interface UserLoginRequest {
    taiKhoan: string
    matKhau: string
  }
export interface CurrentUser {
    taiKhoan: string
    hoTen: string
    // email: string
    // soDT: string
    // maNhom: string
    // maLoaiNguoiDung: string
    accessToken: string
}
export interface DataListUser {
    currentPage: number
    count: number
    totalPages: number
    totalCount: number
    // items: UserItem[]
  }