export interface taskStatus {
  alias: string
  deleted: boolean
  statusId: number
  statusName: string
}

export interface taskPriority {
  alias: string
  deleted: boolean
  priorityId: number
  priorityName: string
}

export interface taskType {
  id: string
  taskType: string
}

export interface taskUser {
  avatar: string
  name: string
  userId: string
  email: string
  phoneNumber: string
}
