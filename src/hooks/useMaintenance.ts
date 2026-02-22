'use client'

import { useEffect, useState } from 'react'

export function useMaintenance() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await fetch('/api/settings/maintenance')
        if (res.ok) {
          const data = await res.json()
          setMaintenanceMode(data.maintenance === true)
        }
      } catch {
        console.error('Maintenance check error')
      }
    }

    checkMaintenance()
  }, [])

  return { maintenanceMode }
}
