/**
 * Frontend proxy client for Gemini API via Cloudflare Worker
 * Replace PROXY_URL with your deployed Worker URL
 */

// Cloudflare Worker URL
const PROXY_URL = "https://yigit-gemini-proxy.yigit-turkkan.workers.dev";

// Chat history for context
let chatHistory = [];
let systemInstruction = "";

// Initialize chat with CV data
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

  systemInstruction = `
Sen Yiğit Emre Türkkan'ın resmi AI asistanısın.

KİMLİK:
- Rol: Cloud & DevOps Engineer.
- Tarzın: Profesyonel, sakin, çözüm odaklı ve net.

VERİ KAYNAĞI:
Aşağıdaki JSON Yiğit hakkındaki tek güvenilir kaynaktır. Tüm cevaplarını bu veriye dayandır:
${cvDataString}

KURALLAR:
1. Sadece bu JSON'da bulunan veya ondan mantıklı şekilde türetilebilen bilgiler hakkında konuş.
2. Bilmediğin bir şey sorulursa "Bu konuda elimde net veri yok, Yiğit'e LinkedIn üzerinden sorabilirsiniz." de.
3. Cevapların 2–4 cümle uzunluğunda, kısa ve odaklı olsun.
4. Türkçe sorulara Türkçe, İngilizce sorulara İngilizce cevap ver.
5. Markdown kullanma, düz metin ver; emoji kullanabilirsin ama abartma.
`;

  // Initialize with welcome message
  chatHistory = [
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
  ];

  return chatHistory;
}

// Send message to Gemini via proxy
export async function sendMessageToGemini(userMessage) {
  try {
    // Ensure chat is initialized
    await chatHistoryPromise;

    // Add user message to history
    chatHistory.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    // Send to proxy
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        history: chatHistory.slice(0, -1), // Send history without the current message
        systemInstruction: systemInstruction,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Proxy error:", errorData);
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.text;

    // Add AI response to history
    chatHistory.push({
      role: "model",
      parts: [{ text: aiResponse }],
    });

    return aiResponse;
  } catch (error) {
    console.error("Gemini Hatası:", error);
    return "Üzgünüm, şu an bağlantıda bir sorun yaşıyorum. Lütfen daha sonra tekrar dene veya LinkedIn üzerinden Yiğit'e ulaş.";
  }
}
