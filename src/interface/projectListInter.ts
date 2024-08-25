export interface Project {
  members: Member[]
  creator: Creator
  id: number
  projectName: string
  description: string
  categoryId: number
  categoryName: CategoryName
  alias: string
  deleted: boolean
}
export enum CategoryName {
  DựÁnDiĐộng = 'Dự án di động',
  DựÁnPhầnMềm = 'Dự án phần mềm',
  DựÁnWeb = 'Dự án web',
}
export interface Creator {
  id: number
  name: string
}
export interface Member {
  userId: number
  name: string
  avatar: string
}
export interface DataListProject {
  pageSize: any
  page: any
  currentPage: number
  count: number
  totalPages: number
  totalCount: number
  items: Project[]
}
export interface ProjectData {
  id: string
  projectsName: string
  categoryId: number
  description: string
  alias: string
}
