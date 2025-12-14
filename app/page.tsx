"use client";

import { useState } from "react";
import { Download, Loader2, Sparkles, Upload, PenTool, Twitter, MessageCircle, Share2, Crown, Gem, Camera, Lightbulb, CheckCircle2, AlertCircle } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// ■ プリセット定義
const PRESETS = [
  // 🆓 FREE PLAN
  { name: "春の桜ポートレート", theme: "pink", isPremium: false, prompt: "cherry blossom viewing, sakura trees in full bloom, wearing a textured spring coat" },
  { name: "夏祭り浴衣", theme: "red", isPremium: false, prompt: "japanese summer festival at night, wearing colorful floral yukata, holding a fan, lanterns and distant fireworks, bustling crowd background" },
  { name: "おしゃれカフェ", theme: "orange", isPremium: false, prompt: "sitting in a sunny terrace cafe, holding a ceramic coffee cup, wearing casual knitted cardigan, blurred cafe background" },
  { name: "韓国風カフェ", theme: "stone", isPremium: false, prompt: "minimalist korean cafe interior, aesthetic style, wearing beige cardigan and denim, holding iced latte, clean white background" },
  { name: "夜景ディナー", theme: "purple", isPremium: false, prompt: "luxury hotel restaurant at night, wearing elegant black dress, pearl necklace, romantic candlelight, city lights bokeh" },
  { name: "白ニットワンピ", theme: "indigo", isPremium: false, prompt: "cozy winter portrait, wearing white cable knit one-piece dress, turtle neck, warm cafe interior lighting, holding a warm mug" },
  { name: "スキニーデニム", theme: "blue", isPremium: false, prompt: "street fashion snap in omotesando, wearing tight blue skinny denim jeans, simple white t-shirt, heels, walking, urban background" },
  { name: "ストリートパーカー", theme: "stone", isPremium: false, prompt: "urban street style, wearing oversized gray hoodie, headphones, cool expression, shibuya crossing background, overcast daylight" },
  { name: "シアーシャツコーデ", theme: "cyan", isPremium: false, prompt: "summer fashion under clear blue sky, wearing sheer transparent shirt, camisole underneath, high waisted pants, bright summer sunlight" },
  { name: "テーマパーク風", theme: "pink", isPremium: false, prompt: "amusement park date, wearing mouse ear headband, holding churros, colorful castle background, happy atmosphere" },
  { name: "制服テーマパーク", theme: "blue", isPremium: false, prompt: "amusement park portrait, wearing japanese school uniform blazer and plaid skirt, loafer, holding popcorn bucket, energetic youth" },
  { name: "成人式（振袖）", theme: "red", isPremium: false, prompt: "japanese ceremony, wearing gorgeous furisode kimono with embroidery, white fur shawl, traditional shrine background, elegant makeup" },
  { name: "卒業式（袴）", theme: "purple", isPremium: false, prompt: "university campus, wearing japanese hakama, holding diploma, cherry blossom petals falling, emotional atmosphere" },
  { name: "清楚女子アナ", theme: "pink", isPremium: false, prompt: "tv studio portrait, wearing pastel colored blouse, flared skirt, holding a microphone, bright studio lighting, professional look" },
  { name: "カフェ店員", theme: "amber", isPremium: false, prompt: "cozy cafe, wearing cafe apron over shirt, holding a tray with coffee, smiling at customer, warm interior lighting" },
  { name: "ナース（看護師）", theme: "pink", isPremium: false, prompt: "hospital portrait, wearing pink nurse uniform, clean hospital corridor background, bright fluorescent lighting" },
  { name: "ポリス（警察官）", theme: "blue", isPremium: false, prompt: "city street, wearing police officer uniform with hat, handcuffs, saluting pose, professional look" },
  { name: "OL（オフィス）", theme: "stone", isPremium: false, prompt: "modern office, wearing tailored suit, id card, holding documents, intellectual look" },
  { name: "アイドル衣装", theme: "rose", isPremium: false, prompt: "live stage, japanese idol costume with sequins and lace, singing, spotlight, confetti falling, energetic performance" },

  // 👑 VIP PLAN
  { name: "リゾート水着", theme: "cyan", isPremium: true, prompt: "resort hotel pool side, wearing fashionable frilled bikini, tropical juice, sunglasses, bright summer sunlight" },
  { name: "もこもこルームウェア", theme: "pink", isPremium: true, prompt: "sitting on bed, wearing fluffy pastel roomwear, messy bun hair, soft morning sunlight from window, cozy atmosphere" },
  { name: "バレエコア", theme: "pink", isPremium: true, prompt: "balletcore fashion, wearing ribbon knit top, tulle skirt, leg warmers, ballet shoes, soft window light, dreamy atmosphere" },
  { name: "Y2Kファッション", theme: "purple", isPremium: true, prompt: "2000s y2k street snap, wearing crop top and mini skirt, colorful hair clips, holding flip phone, pop background" },
  { name: "Acubi (アクビ) 系", theme: "stone", isPremium: true, prompt: "korean street style, wearing tight baby tee and baggy cargo pants, star hair clip, neutral colors, cool vibe" },
  { name: "フレンチガーリー", theme: "stone", isPremium: true, prompt: "paris street cafe, wearing tweed jacket setup, headband, pearl buttons, monochrome and classy atmosphere" },
  { name: "純欲メイク中華風", theme: "red", isPremium: true, prompt: "douyin style makeup, glossy lips, blush, wearing white off-shoulder dress, soft diffused lighting, ethereal beauty" },
  { name: "ブロケットコア", theme: "green", isPremium: true, prompt: "sporty street fashion, mixing soccer jersey with feminine skirt and ribbons, cool pose" },
  { name: "ゴープコア(アウトドア)", theme: "green", isPremium: true, prompt: "camping ground, wearing outdoor windbreaker and technical pants, nature background, active style" },
  { name: "シティガール", theme: "blue", isPremium: true, prompt: "new york street, casual style, wearing oversized shirt, cap, tote bag, film camera vibe" },
  { name: "地雷系ファッション", theme: "purple", isPremium: true, prompt: "kabukicho street, wearing black and pink frilly setup, harness, platform shoes, twin tails, dark cute makeup" },
  { name: "量産型ヲタク", theme: "pink", isPremium: true, prompt: "sweet fashion, wearing pink ribbon blouse and tweed skirt, holding penlight, cute makeup, soft lighting" },
  { name: "古着女子", theme: "amber", isPremium: true, prompt: "shimokitazawa street, wearing vintage patterned knit, long skirt, nostalgic atmosphere" },
  { name: "テックウェア", theme: "stone", isPremium: true, prompt: "night street, wearing all black techwear, many pockets, straps, cyberpunk atmosphere, neon lights" },
  { name: "海外セレブ風", theme: "yellow", isPremium: true, prompt: "paparazzi style, la celebrity, wearing crop tank top and biker shorts, holding starbucks cup, sunglasses, walking dog" },
  { name: "モード系オールブラック", theme: "stone", isPremium: true, prompt: "art gallery, wearing all black mode fashion, wide pants, asymmetric coat, sophisticated look" },
  { name: "トラックジャケット", theme: "blue", isPremium: true, prompt: "street fashion, wearing retro track jacket, jersey, casual trendy look" },
  { name: "キャミワンピ×Tシャツ", theme: "orange", isPremium: true, prompt: "summer park, wearing camisole dress over white t-shirt, layered look, fresh atmosphere" },
  { name: "ショート丈ダウン", theme: "stone", isPremium: true, prompt: "winter street, wearing cropped puffer jacket, high waisted denim, cold winter light" },
  { name: "ビッグカラーブラウス", theme: "pink", isPremium: true, prompt: "flower garden, wearing big collar blouse with embroidery, feminine skirt, romantic style" },
  { name: "アームウォーマーニット", theme: "stone", isPremium: true, prompt: "stylish cafe, wearing knit top with arm warmers, cut out design, cool pose" },
  { name: "ツイードセットアップ", theme: "stone", isPremium: true, prompt: "hotel lounge, wearing tweed jacket and mini skirt set up, elegant lighting, classy look" },
  { name: "クロップド丈Tシャツ", theme: "cyan", isPremium: true, prompt: "summer beach, wearing cropped baby tee showing navel, low rise jeans, energetic vibe" },
  { name: "ファーベストコーデ", theme: "amber", isPremium: true, prompt: "autumn street, wearing fur vest over knit top, mature casual look" },
  { name: "金髪ボブ", theme: "yellow", isPremium: true, prompt: "studio portrait, blonde bob hair, wearing simple white tee, professional lighting" },
  { name: "韓国風ハイトーン", theme: "pink", isPremium: true, prompt: "k-pop style studio portrait, pink straight long hair, trendy makeup, colored contacts" },
  { name: "黒髪ロングぱっつん", theme: "stone", isPremium: true, prompt: "mysterious beauty, black long straight hair, hime cut bangs, pale skin, red lips" },
  { name: "オン眉ショート", theme: "orange", isPremium: true, prompt: "active pop portrait, short hair with short bangs, orange hair color, colorful fashion" },
  { name: "濡れ髪スタイリング", theme: "blue", isPremium: true, prompt: "bar counter, wet look hair styling, wearing off-shoulder top, moody lighting, mature look" },
  { name: "魔法少女", theme: "rose", isPremium: true, prompt: "cosplay, dressed as magical girl holding a wand, frilly pink costume, sparkling effects, not anime" },
  { name: "RPGの女騎士", theme: "stone", isPremium: true, prompt: "fantasy cosplay, wearing knight armor, holding a sword, medieval castle background, brave expression" },
  { name: "宇宙飛行士", theme: "indigo", isPremium: true, prompt: "sci-fi movie style, wearing space suit inside spaceship, galaxy background, futuristic lighting" },
  { name: "大正ロマン", theme: "red", isPremium: true, prompt: "retro style, wearing hakama with arrow patterns, ribbon in hair, old wooden school building, sepia tone" },
  { name: "ヴァンパイア", theme: "red", isPremium: true, prompt: "gothic castle, vampire costume, black dress, pale skin, red lips, candlelight" },
  { name: "森の妖精", theme: "green", isPremium: true, prompt: "magical forest, wearing leaf dress, transparent wings, fireflies, glowing plants" },
  { name: "ウェディングドレス", theme: "sky", isPremium: true, prompt: "church, wearing pure white wedding dress, holding bouquet, soft natural light, happy smile" },
  { name: "チャイナドレス", theme: "red", isPremium: true, prompt: "chinese garden, wearing red cheongsam, holding a fan, elegant pose" },
  { name: "メイド服", theme: "stone", isPremium: true, prompt: "mansion, wearing classic maid costume, apron, headdress, cute pose" },
  { name: "バニーガール", theme: "stone", isPremium: true, prompt: "casino, wearing bunny girl costume, bunny ears, glamorous night party" },
];

export default function Home() {
  const [basePrompt, setBasePrompt] = useState(PRESETS[0].prompt);
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedPresetName, setSelectedPresetName] = useState(PRESETS[0].name);
  const [generatedImage, setGeneratedImage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "1:1" | "16:9">("9:16");
  
  // 顔の強さの初期値 (0.70推奨)
  const [faceStrength, setFaceStrength] = useState(0.70); 
  const [isHighQuality, setIsHighQuality] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ★ 魔法の呪文（修正版）
  // 髪型を固定する言葉を「bob hair」から「same hairstyle as input image」に変更し、誰でも使えるように汎用化
  const MAGIC_PROMPT = "raw candid photo, shot on DSLR, 85mm lens, soft diffused natural daylight, looking straight at camera, direct gaze, eye contact with warm smile, natural eye size, natural eye shape, realistic pupils, gentle expression, soft reflection in eyes, same hairstyle as input image, keep original hair length, detailed skin texture, clear skin, small face, proportional body, individual hair strands, film grain, Kodak Portra 400";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    if (!basePrompt || !selectedImage) return;

    setIsLoading(true);
    setError("");
    setGeneratedImage("");
    
    let adjustedPrompt = basePrompt;
    
    let finalStrength = faceStrength;
    if (aspectRatio === "16:9") {
        adjustedPrompt = `(extreme wide shot:1.5), (full body:1.2), vast background, ${basePrompt}`;
        if (finalStrength < 0.75) finalStrength = 0.75;
    } else {
        adjustedPrompt = `(medium shot), ${basePrompt}`;
    }

    const finalPrompt = `(best quality, masterpiece:1.2), ${adjustedPrompt}, ${MAGIC_PROMPT}, ${customPrompt}`;

    let width = 576;
    let height = 1024;
    
    if (aspectRatio === "1:1") { width = 1024; height = 1024; }
    else if (aspectRatio === "16:9") { width = 1024; height = 576; }
    else { width = 576; height = 1024; }

    // ネガティブプロンプトの強化
    const baseNegative = "(lowres, low quality, worst quality:1.4), (text:1.2), watermark, (frame:1.2), deformed, ugly, deformed eyes, unnatural eyes, buggy eyes, anime eyes, overly large eyes, blur, out of focus, blurring, betrayal, christ, 3d, cartoon, anime, sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, glans, extra fingers, fewer fingers, strange fingers, bad hand, mole, freckles, ((extra legs)), ((extra hands)), (illustration:1.2), (painting:1.2), (doll:1.2), (big head:1.3)";

    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: finalPrompt,
          negative_prompt: baseNegative,
          image: selectedImage,
          strength: finalStrength,
          width: width,
          height: height
        }),
      });

      const data = await response.json();
      if (response.status !== 201) throw new Error(data.detail || "生成エラー");

      let prediction = data;
      
      while (prediction.status !== "succeeded" && prediction.status !== "failed" && prediction.status !== "canceled") {
        await new Promise((resolve) => setTimeout(resolve, 2000)); 
        
        const statusResponse = await fetch(`/api/predictions/${prediction.id}`);
        if (statusResponse.status !== 200) {
            break;
        }
        prediction = await statusResponse.json();
      }

      if (prediction.status === "succeeded") {
        setGeneratedImage(prediction.output[0]);
      } else {
        setError("生成に失敗しました。");
      }
    } catch (err: any) {
      console.error(err);
      setError("エラーが発生しました: " + (err.message || "詳細不明"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareX = () => {
    const shareText = "KIRA☆KIRA Face Swapで変身したよ！✨ #KiraKiraFaceSwap";
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(generatedImage)}`;
    window.open(url, '_blank');
  };

  const handleShareLine = () => {
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(generatedImage)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    const shareText = "KIRA☆KIRA Face Swapで変身したよ！✨ #KiraKiraFaceSwap";
    if (navigator.share) {
      try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File([blob], "face-swap.png", { type: "image/png" });
        await navigator.share({
          title: 'KIRA☆KIRA Face Swap',
          text: shareText,
          files: [file],
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("このブラウザはシェア機能に対応していません");
    }
  };

  const getThemeColor = (theme: string, isActive: boolean) => {
    const colors: {[key: string]: string} = {
      pink: isActive ? "bg-pink-500 border-pink-500" : "hover:border-pink-300 hover:bg-pink-50",
      red: isActive ? "bg-red-500 border-red-500" : "hover:border-red-300 hover:bg-red-50",
      orange: isActive ? "bg-orange-500 border-orange-500" : "hover:border-orange-300 hover:bg-orange-50",
      yellow: isActive ? "bg-yellow-500 border-yellow-500" : "hover:border-yellow-300 hover:bg-yellow-50",
      green: isActive ? "bg-green-500 border-green-500" : "hover:border-green-300 hover:bg-green-50",
      teal: isActive ? "bg-teal-500 border-teal-500" : "hover:border-teal-300 hover:bg-teal-50",
      cyan: isActive ? "bg-cyan-500 border-cyan-500" : "hover:border-cyan-300 hover:bg-cyan-50",
      blue: isActive ? "bg-blue-500 border-blue-500" : "hover:border-blue-300 hover:bg-blue-50",
      indigo: isActive ? "bg-indigo-500 border-indigo-500" : "hover:border-indigo-300 hover:bg-indigo-50",
      purple: isActive ? "bg-purple-500 border-purple-500" : "hover:border-purple-300 hover:bg-purple-50",
      violet: isActive ? "bg-violet-500 border-violet-500" : "hover:border-violet-300 hover:bg-violet-50",
      rose: isActive ? "bg-rose-500 border-rose-500" : "hover:border-rose-300 hover:bg-rose-50",
      stone: isActive ? "bg-stone-500 border-stone-500" : "hover:border-stone-300 hover:bg-stone-50",
      amber: isActive ? "bg-amber-600 border-amber-600" : "hover:border-amber-300 hover:bg-amber-50",
      sky: isActive ? "bg-sky-500 border-sky-500" : "hover:border-sky-300 hover:bg-sky-50",
    };
    return colors[theme] || colors.pink;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col items-center justify-center p-4 py-10 font-sans relative">
      
      {/* ログインボタンエリア */}
      <div className="absolute top-4 right-4 z-50">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-white text-pink-500 px-5 py-2 rounded-full font-bold shadow-md hover:bg-pink-50 transition border border-pink-100">
              ログインして遊ぶ
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1.5 rounded-full flex items-center gap-3 shadow-sm border border-pink-100">
                <span className="text-xs font-bold text-pink-500 ml-2">Welcome!</span>
                <UserButton afterSignOutUrl="/" />
            </div>
        </SignedIn>
      </div>

      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-sm rounded-[3rem] shadow-2xl border-4 border-white p-6 sm:p-10">
        
        {/* ロゴ */}
        <div className="text-center mb-8 flex justify-center">
          <img src="/logo.png" alt="KIRA KIRA Face Swap" className="max-w-[80%] sm:max-w-[400px] h-auto drop-shadow-md hover:scale-105 transition-transform" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 左カラム */}
          <div className="space-y-6">
            
            {/* 1. 画像アップロード */}
            <div className="bg-white p-4 rounded-3xl border-2 border-pink-100 shadow-sm">
              <label className="block text-sm font-bold text-gray-600 mb-2 flex items-center gap-2">
                <span className="bg-pink-100 text-pink-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                写真を選ぶ
              </label>
              <label className="block w-full cursor-pointer group">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center transition-all h-40 overflow-hidden relative ${selectedImage ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400 bg-gray-50'}`}>
                  {selectedImage ? (
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform text-pink-300" />
                      <span className="text-sm font-medium">ここをタップしてね</span>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* 2. スタイル選択 */}
            <div className="bg-white p-4 rounded-3xl border-2 border-pink-100 shadow-sm">
              <label className="block text-sm font-bold text-gray-600 mb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                スタイルを選ぶ
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {PRESETS.map((preset) => {
                  const isActive = selectedPresetName === preset.name;
                  const themeClasses = getThemeColor(preset.theme, isActive);
                  return (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setBasePrompt(preset.prompt);
                        setSelectedPresetName(preset.name);
                      }}
                      className={`relative px-2 py-3 text-xs font-bold rounded-xl border-2 transition-all transform hover:scale-105 ${
                        isActive ? `${themeClasses} text-white shadow-md scale-105` : `bg-white text-gray-500 border-gray-100 ${themeClasses}`
                      }`}
                    >
                      {preset.isPremium && (
                        <div className="absolute -top-1 -right-1 bg-yellow-400 text-white p-0.5 rounded-full shadow-sm z-10 border border-white">
                          <Gem className="w-3 h-3" />
                        </div>
                      )}
                      {preset.name}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 text-xs font-bold text-center p-1 rounded-full bg-gray-100 text-gray-500">
                選択中: <span className="text-pink-500">{selectedPresetName}</span>
              </div>
            </div>

            {/* 3. サイズ選択 */}
            <div className="bg-white p-4 rounded-3xl border-2 border-pink-100 shadow-sm">
              <label className="block text-sm font-bold text-gray-600 mb-2 flex items-center gap-2">
                <span className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                サイズを選ぶ
              </label>
              <div className="flex gap-2">
                {[
                  { id: "9:16", label: "ストーリー (9:16)" },
                  { id: "1:1", label: "正方形 (1:1)" },
                  { id: "16:9", label: "横長 (16:9)" },
                ].map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setAspectRatio(size.id as any)}
                    className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                      aspectRatio === size.id
                        ? "bg-black text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. こだわり入力 */}
            <div className="bg-white p-4 rounded-3xl border-2 border-pink-100 shadow-sm">
              <label className="block text-sm font-bold text-gray-600 mb-2 flex items-center gap-2">
                <span className="bg-yellow-100 text-yellow-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
                こだわり (オプション)
              </label>
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="例: 金髪, 眼鏡, 笑顔..."
                  className="w-full bg-transparent border-b-2 border-gray-200 focus:border-pink-500 outline-none text-sm py-1 transition-colors placeholder-gray-300"
                />
              </div>
            </div>

            {/* 5. 仕上げ設定 */}
            <div className="bg-white p-4 rounded-3xl border-2 border-pink-100 shadow-sm">
              <label className="block text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
                 <span className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">5</span>
                 仕上げ設定
              </label>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">顔のそっくり度</span>
                  <span className="text-xs font-bold text-pink-500">{Math.round(faceStrength * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="1.00"
                  step="0.05"
                  value={faceStrength}
                  onChange={(e) => setFaceStrength(parseFloat(e.target.value))}
                  className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                {aspectRatio === "16:9" && (
                  <p className="text-[10px] text-orange-500 mt-1">※横長モードでは、全身を写すために自動的に顔の強さが調整されます。</p>
                )}
              </div>

              <div className="flex items-center justify-between bg-yellow-50 p-3 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-2">
                  <Crown className={`w-5 h-5 ${isHighQuality ? "text-yellow-500 drop-shadow-sm" : "text-gray-300"}`} />
                  <span className="text-xs font-bold text-gray-700">高画質モード (HD)</span>
                </div>
                <button
                  onClick={() => setIsHighQuality(!isHighQuality)}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isHighQuality ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-inner' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${isHighQuality ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* 生成ボタン */}
            <SignedOut>
                <div className="text-center p-4 bg-gray-100 rounded-2xl border-2 border-gray-200">
                    <p className="text-gray-500 font-bold mb-2 text-sm">遊ぶにはログインしてね！</p>
                    <SignInButton mode="modal">
                        <button className="w-full bg-pink-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-pink-600 transition">
                            Googleでログインする
                        </button>
                    </SignInButton>
                </div>
            </SignedOut>

            <SignedIn>
                <button
                onClick={generateImage}
                disabled={isLoading || !selectedImage}
                className={`w-full text-white py-5 rounded-2xl font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-xl transform hover:scale-[1.02] active:scale-95 ${
                    isHighQuality 
                    ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-orange-200 border-b-4 border-orange-600" 
                    : "bg-gradient-to-r from-pink-400 via-rose-500 to-purple-500 shadow-pink-200 border-b-4 border-pink-600"
                }`}
                >
                {isLoading ? <Loader2 className="animate-spin w-8 h-8" /> : (
                    <>
                    <Sparkles className="w-6 h-6 animate-pulse" /> 
                    {isHighQuality ? "スーパー変身！" : "かわいく変身！"}
                    </>
                )}
                </button>
            </SignedIn>
          
          </div>

          {/* 右カラム：結果表示 */}
          <div className="flex flex-col gap-6">
            <div className={`flex-grow bg-white rounded-[2rem] border-4 border-pink-100 flex items-center justify-center relative overflow-hidden min-h-[500px] shadow-inner ${generatedImage ? 'border-pink-400' : ''}`}>
              {generatedImage ? (
                <>
                  <img src={generatedImage} alt="Generated" className="w-full h-full object-cover animate-in fade-in duration-700" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-4">
                    <a href={generatedImage} download target="_blank" rel="noreferrer" className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-pink-50 transition-all shadow-lg border-b-4 border-gray-200 active:border-b-0 active:translate-y-1">
                      <Download className="w-5 h-5 text-pink-500" /> 画像を保存する
                    </a>
                    <div className="flex gap-3 justify-center">
                      <button onClick={handleShareX} className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-all shadow-lg hover:scale-110" title="Xでシェア">
                        <Twitter className="w-5 h-5" />
                      </button>
                      <button onClick={handleShareLine} className="bg-[#06C755] text-white p-3 rounded-full hover:bg-[#05b34c] transition-all shadow-lg hover:scale-110" title="LINEで送る">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button onClick={handleNativeShare} className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-all shadow-lg hover:scale-110" title="スマホで共有">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 opacity-40">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
                      </div>
                      <p className="font-bold text-pink-500 animate-pulse text-lg">魔法をかけています...<br/><span className="text-sm text-gray-400">(ちょっと待ってね)</span></p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center group">
                      <div className="bg-pink-50 p-6 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <Camera className="w-12 h-12 text-pink-300" />
                      </div>
                      <p className="text-gray-400 font-bold">ここに完成した写真が出るよ✨</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {error && (
              <div className="p-4 bg-red-100 text-red-500 text-sm rounded-2xl border-2 border-red-200 flex items-center gap-2 font-bold animate-bounce">
                <span className="text-xl">⚠️</span> {error}
              </div>
            )}
            
            {/* プロンプトのコツ セクション */}
            <div className="bg-white rounded-3xl border-2 border-pink-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-bold text-gray-700">もっと可愛く作るコツ</h3>
                </div>
                <div className="space-y-3 text-xs text-gray-600">
                    <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                        <p><span className="font-bold">元画像の選び方:</span> 顔がはっきり写っていて、前髪で目が隠れていない写真がベストです！</p>
                    </div>
                    <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                        <p><span className="font-bold">そっくり度調整:</span> 「似すぎて怖い」ときは、仕上げ設定で50%〜60%くらいに下げると自然に盛れます。</p>
                    </div>
                    <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                        <p><span className="font-bold">こだわり入力:</span> 「ショートヘア」「ロングヘア」など、なりたい髪型を入力するとイメチェンできます。</p>
                    </div>
                </div>
            </div>

            {/* 注意事項エリア */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-[10px] text-gray-500 text-left space-y-2">
              <div className="flex items-center gap-1 mb-1 justify-center font-bold text-gray-400">
                <AlertCircle className="w-3 h-3" /> ご利用上の注意
              </div>
              <ul className="list-disc pl-4 space-y-1">
                <li>有名人や他人、実在するキャラクターの画像の無断使用は禁止です。</li>
                <li>アダルト、暴力、差別的、その他公序良俗に反する画像の生成は固く禁止されています。</li>
                <li>アップロードされた写真は生成処理のみに使用され、AIの学習には使用されません。</li>
                <li>生成された画像の使用により発生したトラブルについて、運営は一切の責任を負いません。</li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}