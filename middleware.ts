import { clerkMiddleware } from "@clerk/nextjs/server";

// これで全てのページ・APIに対して認証チェックが有効になります
export default clerkMiddleware();

export const config = {
  matcher: [
    // Next.jsの内部ファイルや静的ファイルを除外
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // APIルートは必ずチェック対象にする
    '/(api|trpc)(.*)',
  ],
};