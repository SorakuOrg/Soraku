export type Role = 'MANAGER' | 'AGENSI' | 'ADMIN' | 'USER'

export const ROLES: Record<Role, number> = {
  MANAGER: 4,
  AGENSI: 3,
  ADMIN: 2,
  USER: 1,
}

export const PERMISSIONS = {
  // Vtuber
  vtuber: {
    create: ['MANAGER', 'AGENSI'] as Role[],
    edit: ['MANAGER', 'AGENSI'] as Role[],
    delete: ['MANAGER'] as Role[],
    view: ['MANAGER', 'AGENSI', 'ADMIN', 'USER'] as Role[],
  },
  // Blog
  blog: {
    create: ['MANAGER', 'ADMIN'] as Role[],
    edit: ['MANAGER', 'ADMIN'] as Role[],
    delete: ['MANAGER'] as Role[],
    view: ['MANAGER', 'AGENSI', 'ADMIN', 'USER'] as Role[],
  },
  // Events
  events: {
    create: ['MANAGER', 'AGENSI'] as Role[],
    edit: ['MANAGER', 'AGENSI'] as Role[],
    delete: ['MANAGER'] as Role[],
    view: ['MANAGER', 'AGENSI', 'ADMIN', 'USER'] as Role[],
  },
  // Gallery
  gallery: {
    upload: ['MANAGER', 'AGENSI', 'ADMIN', 'USER'] as Role[],
    approve: ['MANAGER', 'ADMIN'] as Role[],
    delete: ['MANAGER'] as Role[],
  },
  // Users
  users: {
    manage: ['MANAGER'] as Role[],
    view: ['MANAGER', 'ADMIN'] as Role[],
  },
  // Admin panel
  admin: {
    access: ['MANAGER', 'AGENSI', 'ADMIN'] as Role[],
    full: ['MANAGER'] as Role[],
    settings: ['MANAGER'] as Role[],
  },
}

export function hasPermission(role: Role | undefined, permission: Role[]): boolean {
  if (!role) return false
  return permission.includes(role)
}

export function isAtLeast(role: Role | undefined, minRole: Role): boolean {
  if (!role) return false
  return ROLES[role] >= ROLES[minRole]
}

export const ROLE_COLORS: Record<Role, string> = {
  MANAGER: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  AGENSI: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  ADMIN: 'bg-green-500/20 text-green-300 border-green-500/30',
  USER: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
}
