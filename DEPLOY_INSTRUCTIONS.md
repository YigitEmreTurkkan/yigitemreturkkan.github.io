# Cloudflare Worker Deployment Instructions

## Adım 1: Wrangler CLI Kurulumu

Terminal'de şu komutları çalıştır:

```bash
npm install -g wrangler
wrangler login
```

`wrangler login` komutu tarayıcını açacak ve Cloudflare hesabına giriş yapmanı isteyecek.

## Adım 2: API Key'i Secret Olarak Ekle

```bash
wrangler secret put GEMINI_API_KEY
```

Komut senden API key'i isteyecek. Gemini API key'ini yapıştır ve Enter'a bas.

## Adım 3: Worker'ı Deploy Et

```bash
wrangler deploy
```

Bu komut `cloudflare-worker.js` dosyasını Cloudflare'a yükleyecek ve bir URL verecek. Örnek:

```
https://yigit-gemini-proxy.your-subdomain.workers.dev
```

## Adım 4: Frontend'i Güncelle

1. `gemini-chat-proxy.js` dosyasını aç
2. En üstteki `PROXY_URL` değişkenini bul:
   ```javascript
   const PROXY_URL = "https://YOUR-WORKER-URL.workers.dev";
   ```
3. `YOUR-WORKER-URL` kısmını Adım 3'te aldığın URL ile değiştir:
   ```javascript
   const PROXY_URL = "https://yigit-gemini-proxy.your-subdomain.workers.dev";
   ```

## Adım 5: Test Et

1. GitHub Pages'de siteni yenile
2. Chat'e bir mesaj yaz
3. Console'u aç (F12) ve hata olup olmadığını kontrol et

## Sorun Giderme

### "API key not configured" hatası
- `wrangler secret put GEMINI_API_KEY` komutunu tekrar çalıştır ve API key'i doğru girdiğinden emin ol

### CORS hatası
- Worker'da CORS headers zaten var, ama GitHub Pages URL'ini `Access-Control-Allow-Origin`'e eklemen gerekebilir

### "Worker not found" hatası
- `wrangler deploy` komutunun başarılı olduğundan emin ol
- URL'yi `gemini-chat-proxy.js`'de doğru yazdığından emin ol

## Notlar

- Worker ücretsiz planında günde 100,000 istek limiti var (yeterli olmalı)
- API key artık frontend kodunda görünmüyor, sadece Cloudflare'da secret olarak saklanıyor
- Worker'ı güncellemek için sadece `wrangler deploy` komutunu tekrar çalıştır
