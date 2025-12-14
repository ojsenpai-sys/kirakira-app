import { NextResponse } from "next/server";
import Replicate from "replicate";
import { auth, currentUser } from "@clerk/nextjs/server";
// ↓ ファイルの場所指定は "../" 3つで合っています
import prismadb from "../../../lib/prismadb";

const FREE_LIMIT = 3;

export async function POST(request: Request) {
  try {
    // ---------------------------------------------------------
    // ★ 犯人探しのための捜査ログ
    // ---------------------------------------------------------
    console.log("================================================");
    console.log("🕵️‍♀️ デバッグ捜査を開始します");

    const secretKey = process.env.CLERK_SECRET_KEY;
    console.log(`🔑 CLERK_SECRET_KEY: ${secretKey ? "✅ あり" : "❌ なし"}`);

    // ★【ここが修正ポイント！】
    // auth() の前に await を付けました。これで正しくIDが取れます。
    const { userId } = await auth();
    
    if (userId) {
        console.log(`👤 ユーザー認証: ✅ OK (ID: ${userId})`);
    } else {
        console.log("👤 ユーザー認証: ❌ NG (IDが取れませんでした)");
    }
    console.log("================================================");
    // ---------------------------------------------------------

    const user = await currentUser();

    if (!userId || !user) {
      console.log("🚫 エラー: 401 Unauthorized を返します");
      return NextResponse.json({ detail: "ログインしていません（Unauthorized）" }, { status: 401 });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ detail: "Replicate API token not set" }, { status: 500 });
    }

    let userRecord = await prismadb.user.findUnique({
      where: { userId: userId },
    });

    console.log("📊 現在のカウント:", userRecord ? userRecord.count : "初回アクセス");

    if (!userRecord) {
      console.log("✨ 新規ユーザー登録します");
      userRecord = await prismadb.user.create({
        data: { userId: userId, count: 0 },
      });
    }

    if (userRecord.count >= FREE_LIMIT && !userRecord.isPremium) {
      console.log("🚫 制限到達！エラーを返します");
      return NextResponse.json(
        { detail: "無料枠の上限（3回）に達しました。明日また試してね！" }, 
        { status: 403 } 
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const { prompt, negative_prompt, image, strength, width, height } = await request.json();

    const model = await replicate.models.get("fofr", "face-to-many");
    const latestVersion = model.latest_version?.id;

    if (!latestVersion) throw new Error("モデルが見つかりません");

    console.log("🚀 Replicateで生成を開始します...");

    const prediction = await replicate.predictions.create({
      version: latestVersion,
      input: {
        image,
        prompt,
        negative_prompt,
        instant_id_strength: strength || 0.7,
        denoising_strength: 0.85, 
        control_depth_strength: 0.40, 
        width: width || 640,
        height: height || 1024,
        disable_safety_checker: true,
      },
    });

    const newCount = userRecord.count + 1;
    await prismadb.user.update({
      where: { userId: userId },
      data: { count: newCount },
    });
    
    console.log("✅ カウントアップ完了: " + userRecord.count + " -> " + newCount);
    console.log("------------------------------------------------");

    return NextResponse.json(prediction, { status: 201 });

  } catch (error: any) {
    console.error("★ Error:", error);
    return NextResponse.json({ detail: error.message || "Error" }, { status: 500 });
  }
}