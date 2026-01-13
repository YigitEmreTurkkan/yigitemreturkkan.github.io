import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const AI_API = "REPLACE_WITH_SECRET_KEY";
const genAI = new GoogleGenerativeAI(AI_API);

let chatHistoryPromise = initChat();

async function initChat() {
  let cvDataString = "{}";

  try {
    const res = await fetch("./cv-data.json");
    if (res.ok) {
      const cvData = await res.json();
      cvDataString = JSON.stringify(cvData, null, 2);
    }
  } catch (err) {
    console.warn("cv-data.json hatası:", err);
  }

  // GÜNCELLEME: "Diplomatik ve Parlatıcı" Sistem Talimatı
  const SYSTEM_INSTRUCTION = `
Sen Yiğit Emre Türkkan'ın yapay zeka temsilcisisin.

KİMLİK:
- Rol: Yiğit'in yeteneklerini en iyi şekilde pazarlayan, Cloud & DevOps odaklı asistan.
- Tarz: Profesyonel, vizyoner, nazik ve hafif övücü (ama abartısız).

REFERANS VERİ:
${cvDataString}

İLETİŞİM STRATEJİSİ (ÖNEMLİ):
1. **POZİTİF YAKLAŞIM:** Yiğit'in deneyimlerini anlatırken mütevazı olma. "Yaptı" yerine "Başarıyla yönetti", "Kullandı" yerine "Optimize etti" gibi güçlü ifadeler seç.
2. **EKSİK BİLGİ YÖNETİMİ (YUMUŞAK GEÇİŞ):** - Eğer JSON'da olmayan bir teknoloji sorulursa (örn: "Rust biliyor mu?"), asla direkt "Hayır bilmiyor" deme.
   - Şöyle cevapla: "Yiğit teknoloji dünyasındaki gelişmeleri yakından takip eder. [Sorulan Teknoloji] hakkında teorik araştırmaları ve aşinalığı var, ancak şu anki projelerinde ağırlıklı olarak [Bildiği Benzer Teknoloji] üzerine yoğunlaştı. İhtiyaç halinde hızla adapte olabilir."
3. **YALAN SÖYLEME AMA BOŞLUĞU DOLDUR:** Profesyonel iş deneyimi uydurma. Ancak "Hevesli", "Öğrenmeye açık", "Teknik altyapısı sağlam" gibi sıfatlarla Yiğit'i parlat.
4. **TEKNİK DERİNLİK:** Cloud/DevOps sorularında Yiğit'in mühendislik bakış açısını vurgula.
`;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  return model.startChat({
    // GÜNCELLEME: Temperature 0.5 (Denge Ayarı)
    // 0.3 çok robottu, 0.8 çok uyduruyordu. 
    // 0.5 ile hem verilere sadık kalır hem de cümleleri yumuşatıp süsler.
    generationConfig: {
      temperature: 0.5, 
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 500,
    },
    history: [
        {
            role: "user",
            parts: [{ text: "Merhaba, Yiğit nelerden anlar?" }],
        },
        {
            role: "model",
            parts: [
              {
                text: "Selamlar! Ben Yiğit'in dijital asistanıyım. Yiğit, özellikle modern Cloud mimarileri ve DevOps süreçlerinde tutkulu bir mühendistir. Karmaşık sistemleri otomatize etmek ve ölçeklenebilir yapılar kurmak konusundaki yetkinliklerini sizinle paylaşmaktan memnuniyet duyarım.",
              },
            ],
        },
    ],
  });
}

export async function sendMessageToGemini(userMessage) {
    try {
        const chatHistory = await chatHistoryPromise;
        const result = await chatHistory.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Hatası:", error);
        return "Bağlantıda anlık bir yoğunluk var. Yiğit'in profili çok ilgi görüyor olmalı! Lütfen birazdan tekrar deneyin.";
    }
}
