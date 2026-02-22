'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import type { Role } from '@/lib/roles'

export function useAuthRole() {
  const { user, isLoaded } = useUser()
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) return
    if (!user) {
      setRole(null)
      setLoading(false)
      return
    }

    const fetchRole = async () => {
      try {
        const res = await fetch('/api/users/me')
        if (res.ok) {
          const data = await res.json()
          setRole(data.role || 'USER')
        } else {
          setRole('USER')
        }
      } catch {
        setRole('USER')
      } finally {
        setLoading(false)
      }
    }

    fetchRole()
  }, [user, isLoaded])

  return { role, loading, user }
}
