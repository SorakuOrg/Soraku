'use client'

import { AlertTriangle } from 'lucide-react'

export default function MaintenanceBanner() {
  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-yellow-300 text-sm">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>Platform sedang dalam mode maintenance. Beberapa fitur mungkin tidak tersedia.</span>
      </div>
    </div>
  )
}
