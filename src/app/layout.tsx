import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Soraku Community',
    template: '%s | Soraku',
  },
  description: 'Platform komunitas Pop Jepang & Anime — Soraku Community',
  keywords: ['vtuber', 'anime', 'pop jepang', 'community', 'indonesia', 'soraku'],
  openGraph: {
    title: 'Soraku Community',
    description: 'Platform komunitas Pop Jepang & Anime Indonesia',
    type: 'website',
    images: [
      {
        url: 'https://blogger.googleusercontent.com/img/a/AVvXsEhlhs4Uhd-DSMY2uER618DpZkDLuupIyT5GmQDqdMmM31HF3XGi1om60_82VyP_P4r7aZlpqz8zCXNFe_-qfsBRQ63m_NcTD_viFP5pTpR4-sgfTGfK0BSUpjixF8N7eZdV7oki8kkq5uivp_Xo=w150-h150-p-k-no-nu-rw-e90',
        alt: 'Soraku Community Logo',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#4FA3D1',
          colorBackground: '#1C1E22',
          colorInputBackground: '#23262D',
          colorInputText: '#D9DDE3',
          colorText: '#D9DDE3',
          colorTextSecondary: '#6E8FA6',
          borderRadius: '12px',
        },
        elements: {
          card: 'bg-[#23262D] border border-white/10 shadow-xl',
          headerTitle: 'text-white font-bold',
          headerSubtitle: 'text-[#6E8FA6]',
          socialButtonsBlockButton:
            'bg-white/5 border border-white/10 text-white hover:bg-white/10',
          formButtonPrimary:
            'bg-[#4FA3D1] hover:bg-[#4FA3D1]/80 text-white',
          footerActionLink: 'text-[#4FA3D1] hover:text-[#4FA3D1]/80',
          dividerLine: 'bg-white/10',
          dividerText: 'text-[#6E8FA6]',
          formFieldInput:
            'bg-[#1C1E22] border-white/10 text-white placeholder:text-[#6E8FA6]',
          formFieldLabel: 'text-[#D9DDE3]',
        },
      }}
    >
      <html lang="id">
        <body className="bg-dark-base text-light-base antialiased">
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#23262D',
                color: '#D9DDE3',
                border: '1px solid rgba(79, 163, 209, 0.2)',
                borderRadius: '12px',
              },
              success: { iconTheme: { primary: '#4FA3D1', secondary: '#1C1E22' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#1C1E22' } },
            }}
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
