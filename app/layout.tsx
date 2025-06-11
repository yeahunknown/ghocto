import type React from "react"
import Head from "next/head"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "WaveLaunch",
  description: "Solana Spl Token Solutions, No Code and no struggle.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="trustpilot-one-time-domain-verification-id" content="8240dd3f-703a-4d69-bd42-b5d1b6e43c4a" />
      </Head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
