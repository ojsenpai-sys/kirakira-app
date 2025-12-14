import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs' // ★ 1. ClerkProviderをインポート
import { jaJP } from '@clerk/localizations' // ★ 2. 日本語化をインポート

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'KIRA KIRA Face Swap App', // タイトルを分かりやすく修正
  description: 'AI Face Swap with Next.js and Clerk',
}

// export default function RootLayout({
export default function RootLayout({ // RootLayout 関数の定義開始
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // ★ 3. <ClerkProvider> で全体を囲む
    <ClerkProvider localization={jaJP}> 
      <html lang="ja">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
    // ★ 4. </ClerkProvider> で閉じる
  )
}