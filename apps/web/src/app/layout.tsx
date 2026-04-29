import type { Metadata } from "next"
import { Geist } from "next/font/google"

import "@tome/ui/globals.css"

import { cn } from "@tome/ui/lib/utils"

import { Footer } from "@/components/footer"
import Header from "@/components/header"
import Providers from "@/components/providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "tome",
  description: "tome",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "antialiased min-h-dvh flex flex-col overflow-x-hidden",
          geistSans.className
        )}
      >
        <Providers>
          <Header />
          <main className="flex min-h-dvh h-full flex-col bg-background w-full max-w-7xl mx-auto">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
