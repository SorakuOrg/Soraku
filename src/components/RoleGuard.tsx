'use client'

import { useAuthRole } from '@/hooks/useAuthRole'
import type { Role } from '@/lib/roles'

interface RoleGuardProps {
  allowedRoles: Role[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { role, loading } = useAuthRole()

  if (loading) return null

  if (!role || !allowedRoles.includes(role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
