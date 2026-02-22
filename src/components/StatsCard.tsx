'use client'

import { useState, useEffect } from 'react'
import { Users, Wifi, RefreshCw } from 'lucide-react'

interface DiscordStats {
  members: number
  online: number
  cached: boolean
  error?: boolean
}

export default function StatsCard() {
  const [stats, setStats] = useState<DiscordStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/discord', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setStats(data)
        setLastUpdated(new Date())
      }
    } catch {
      console.error('Failed to fetch Discord stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
            <span className="text-indigo-400 text-xs font-bold">DC</span>
          </div>
          <h3 className="font-semibold text-white">Discord Server</h3>
        </div>
        <button
          onClick={fetchStats}
          className="p-1.5 rounded-lg text-secondary hover:text-white hover:bg-white/10 transition-all"
          title="Refresh stats"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
              <div className="h-8 w-16 bg-white/10 rounded mb-2" />
              <div className="h-4 w-20 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/10 rounded-xl p-4 border border-primary/10">
            <Users className="w-4 h-4 text-primary mb-1" />
            <div className="text-2xl font-bold text-white">
              {stats.members.toLocaleString()}
            </div>
            <div className="text-xs text-secondary mt-1">Total Members</div>
          </div>
          <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/10">
            <Wifi className="w-4 h-4 text-green-400 mb-1" />
            <div className="text-2xl font-bold text-white">
              {stats.online.toLocaleString()}
            </div>
            <div className="text-xs text-secondary mt-1">Online Sekarang</div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-secondary text-sm">
          Gagal memuat stats Discord
        </div>
      )}

      {lastUpdated && (
        <p className="text-xs text-secondary/50 mt-4 text-right">
          Update: {lastUpdated.toLocaleTimeString('id-ID')}
          {stats?.cached && ' (cached)'}
        </p>
      )}
    </div>
  )
}
