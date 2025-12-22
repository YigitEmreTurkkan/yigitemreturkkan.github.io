import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// API anahtarını tek bir yerde tut
const AI_API = "REPLACE_WITH_SECRET_KEY";
const genAI = new GoogleGenerativeAI(AI_API);

// Chat oturumunu asenkron olarak başlat
let chatHistoryPromise = initChat();

async function initChat() {
  let cvDataString = "{}";

  try {
    const res = await fetch("./cv-data.json");
    if (res.ok) {
      const cvData = await res.json();
      cvDataString = JSON.stringify(cvData, null, 2);
    } else {
      console.warn("cv-data.json yüklenemedi:", res.status);
    }
  } catch (err) {
    console.warn("cv-data.json okunurken hata:", err);
  }

const SYSTEM_INSTRUCTION = `
Sen Yiğit Emre Türkkan'ın resmi AI asistanısın.

KİMLİK:
- Rol: Cloud & DevOps Engineer.
- Tarzın: Profesyonel, sakin, çözüm odaklı ve net.

VERİ KAYNAĞI:
Aşağıdaki JSON Yiğit hakkındaki tek güvenilir kaynaktır. Tüm cevaplarını bu veriye dayandır:
${cvDataString}

KURALLAR:
1. Sadece bu JSON'da bulunan veya ondan mantıklı şekilde türetilebilen bilgiler hakkında konuş.
2. Bilmediğin bir şey sorulursa "Bu konuda elimde net veri yok, Yiğit’e LinkedIn üzerinden sorabilirsiniz." de.
3. Cevapların 2–4 cümle uzunluğunda, kısa ve odaklı olsun.
4. Türkçe sorulara Türkçe, İngilizce sorulara İngilizce cevap ver.
5. Markdown kullanma, düz metin ver; emoji kullanabilirsin ama abartma.
`;

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
});

  return model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: "Merhaba, sen kimsin?" }],
        },
        {
            role: "model",
        parts: [
          {
            text:
              "Merhaba! Ben Yiğit Emre Türkkan'ın yapay zeka asistanıyım. Yiğit'in Cloud & DevOps deneyimi, projeleri ve teknik yaklaşımı hakkında sorularını yanıtlamak için buradayım.",
          },
        ],
        },
    ],
});
}

// Mesaj gönderme fonksiyonu
export async function sendMessageToGemini(userMessage) {
    try {
    const chatHistory = await chatHistoryPromise;
        const result = await chatHistory.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Hatası:", error);
    return "Üzgünüm, şu an bağlantıda bir sorun yaşıyorum. Lütfen daha sonra tekrar dene veya LinkedIn üzerinden Yiğit'e ulaş.";
    }
}


