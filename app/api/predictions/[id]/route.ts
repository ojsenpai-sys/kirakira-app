import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  // ★ ここが修正ポイント！
  // 最新のNext.jsでは、URLのIDを取り出す時に "await" が必要になりました
  const params = await props.params;
  const predictionId = params.id;

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    // 公式ツールを使って、AIの作業状況を確認します
    const prediction = await replicate.predictions.get(predictionId);
    
    // エラーがあった場合
    if (prediction?.error) {
      return NextResponse.json({ detail: prediction.error }, { status: 500 });
    }

    return NextResponse.json(prediction);
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}