import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// 1. ADIM: API Anahtarını buraya yapıştır
const API_KEY = "REMOVED_API_KEY";

// 2. ADIM: Kişilik Tanımlaması (System Instruction)
const SYSTEM_INSTRUCTION = `
Sen Yiğit Emre Türkkan'ın AI asistanısın. Asla kendi kimliğinden çıkma.
Sen bir Junior Cloud & DevOps Engineer uzmanısın.
İsmim Yiğit, senin görevin benim portfolyomda ziyaretçilerin sorularını yanıtlamak.

BİLGİLERİM:
- Rol: Junior Cloud Engineer @ CloudFlex (Eylül 2025 - Halen)
- Önceki: Jr. DevOps Müh @ Eteration, Intern Java Dev @ Hitit.
- Yetkinlikler: Kubernetes, Docker, AWS, Azure, GitLab CI/CD, Terraform.
- Eğitim: Muğla Sıtkı Koçman Üniversitesi.
- Konum Tercihi: Remote & Hybrid çalışmaya uygunum. Global projelere açığım.

DAVRANIŞ KURALLARI:
- Cevapların kısa, profesyonel ve "tech-savvy" olsun.
- Sadece Yiğit'in profesyonel hayatı hakkında konuş. Özel hayat sorulursa kibarca LinkedIn'e yönlendir.
- Türkçe sorulursa Türkçe, İngilizce sorulursa İngilizce cevap ver.
`;

// Model Ayarları
const genAI = new GoogleGenerativeAI(API_KEY);
// Not: Bazı istemciler için "gemini-1.5-flash" modeli v1beta altında 404 verebiliyor.
// Bu yüzden "-latest" uzantılı ismi kullanıyoruz.
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    systemInstruction: SYSTEM_INSTRUCTION
});

// Sohbet Geçmişini Başlat
let chatHistory = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: "Merhaba, sen kimsin?" }],
        },
        {
            role: "model",
            parts: [{ text: "Merhaba! Ben Yiğit Emre Türkkan'ın yapay zeka asistanıyım. Yiğit'in Cloud mimarileri, DevOps süreçleri veya projeleri hakkındaki sorularınızı yanıtlamak için buradayım." }],
        },
    ],
});

// Mesaj Gönderme Fonksiyonu
export async function sendMessageToGemini(userMessage) {
    try {
        const result = await chatHistory.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Hatası:", error);
        return "Üzgünüm, şu an bağlantıda bir sorun yaşıyorum. Lütfen LinkedIn üzerinden Yiğit'e ulaşın.";
    }
}