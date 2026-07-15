import type { Metadata } from "next"
import { Share_Tech_Mono, VT323 } from "next/font/google"
import { ScanlineProvider } from "@/components/ScanlineProvider"
import "./globals.css"

const mono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
})

const display = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "Where Gamers Meet",
  description: "Trouvez des adversaires pour vos parties sur vos jeux préférés.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${mono.variable} ${display.variable} font-mono antialiased`}>
        <ScanlineProvider />
        {children}
      </body>
    </html>
  )
}
