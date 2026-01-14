export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  PRO: 'pro',
  TESTER: 'tester',
  GUEST: 'guest'
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export interface User {
  id: number
  fullName: string
  email: string
  lives: number
  lives_reset_at: number
  role: UserRole
  [key: string]: any
}