# Fotoğraflar

Tüm fotoğraflar bu klasörden yönetilir. Dosya adlarını [site.config.ts](../../site.config.ts)
içindeki yollarla eşleştir. Fotoğraf eklemesen bile site büyülü bir yer tutucu
gösterir — asla kırık görsel çıkmaz.

## Giriş ekranı & marka
- `hogwarts-night.jpg` — şifre kapısının arka planındaki gerçek Hogwarts görseli.
- `hogwarts-logo.png` — yükleme ekranındaki Hogwarts arması.

## Fotoğraf VEYA video
Fotoğraf eklenebilen her yere **video** da ekleyebilirsin. Dosya yolunu `.mp4`
veya `.webm` uzantısıyla vermen yeterli — sistem otomatik algılar, doğru şekilde
(kırpmadan, en-boy oranını koruyarak) gösterir.

## Sahne arka planları (sinematik)
`site.config.ts` → `scenes` bölümünden her sahneye düşük opaklıkta bir arka plan
görseli/videosu verebilirsin (`image`, `video`, `opacity`, `blur`).

## Çapulcu Haritası & Hortkuluklar (timeline)
- `first-message.jpg` — İlk Mesaj
- `first-meet.jpg` — İlk Tanışma
- `first-date.jpg` — İlk Buluşma
- `first-photo.jpg` — İlk Fotoğraf
- `first-trip.jpg` — İlk Seyahat
- `first-anniversary.jpg` — İlk Yıldönümü
- `first-gift.jpg` — İlk Hediye
- `first-hug.jpg` — İlk Sarılma

## Düşünce Havuzu (Pensieve)
- `m1.jpg` … `m6.jpg`

## Zaman Kapsülü
- `capsule-1.jpg`

Her fotoğrafın başlığı, açıklaması ve tarihi `site.config.ts` içinde tutulur.
Yeni fotoğraf eklemek için yalnızca dosyayı buraya koy ve config'teki yolu yaz.
