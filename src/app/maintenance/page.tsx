import Link from 'next/link'
import { MessageCircle, Wrench } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center px-4">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-lg w-full glass-card p-12 text-center">
        <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <Wrench className="w-10 h-10 text-yellow-400 animate-float" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Under Maintenance</h1>
        <p className="text-secondary mb-8 leading-relaxed">
          Platform Soraku sedang dalam proses pemeliharaan. Kami akan kembali segera.
          Tetap ikuti update kami di Discord!
        </p>
        
        <a
          href="https://discord.gg/soraku"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Join Discord untuk Update
        </a>
        
        <p className="text-secondary/40 text-xs mt-8">
          Soraku Community &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
