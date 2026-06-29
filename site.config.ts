// ============================================================================
//  🪄  HOGWARTS YILDÖNÜMÜ — TEK MERKEZÎ AYAR DOSYASI
//  Sitedeki HER ŞEYİ buradan düzenleyebilirsin: isimler, tarih, müzik,
//  her sahnenin metinleri, anılar, fotoğraflar, mektuplar...
//  Fotoğraflar:  /public/photos/  klasörüne koy, yolu buraya yaz.
//  Başka hiçbir dosyaya dokunmana gerek yok.
// ============================================================================

export type HouseKey = "gryffindor" | "slytherin" | "ravenclaw" | "hufflepuff";

export interface Photo {
  src?: string; // /photos/...  (boşsa büyülü yer tutucu çıkar)
  video?: string; // /photos/...mp4  (doluysa fotoğrafın yerine VİDEO gösterilir)
  title: string;
  caption: string;
  date: string;
}

export interface MapStop {
  id: string;
  title: string;
  date: string;
  location: string;
  icon: string;
  story: string;
  photo?: string;
  video?: string; // doluysa fotoğraf yerine video
}

export interface Relic {
  id: string;
  name: string;
  symbol: string;
  date: string;
  message: string;
  photo?: string;
}

export interface CapsuleItem {
  id: string;
  kind: "letter" | "photo" | "parchment" | "note";
  title: string;
  body: string;
  photo?: string;
  video?: string; // doluysa fotoğraf yerine video
}

export const config = {
  // 👩‍❤️‍👨 KİŞİSEL
  girlfriendName: "Şermin",
  yourName: "Ersan",
  anniversaryDate: "21.06.2025",

  house: "gryffindor" as HouseKey,
  autoAdvance: true,

  // 🎵 ARKA PLAN MÜZİĞİ ( public/audio/ )
  audio: {
    src: "/audio/background.mp3",
    volume: 0.35,
  },

  // ==========================================================================
  //  🖼️  SAHNE ARKA PLANLARI (sinematik doldurma — merkezi yönetim)
  //  Her bölüme bir arka plan görseli VEYA videosu verebilirsin.
  //  Görseller %5–25 opaklıkta, bulanık ve gradyanla yumuşatılmış gösterilir;
  //  ana içeriğin ve okunabilirliğin önüne asla geçmez.
  //  Boş bırakırsan o sahnenin mevcut atmosferi (gradyan/sis/parçacık) kalır.
  //  Dosyaları /public/photos/ içine koy.
  // ==========================================================================
  scenes: {
    letter: { image: "/photos/hogwarts-night.jpg", video: "", opacity: 0.14, blur: 3 },
    sorting: { image: "", video: "", opacity: 0.16, blur: 3 },
    map: { image: "", video: "", opacity: 0.12, blur: 2 },
    pensieve: { image: "", video: "", opacity: 0.14, blur: 4 },
    patronus: { image: "", video: "", opacity: 0.12, blur: 4 },
    prophecy: { image: "", video: "", opacity: 0.14, blur: 3 },
    capsule: { image: "", video: "", opacity: 0.14, blur: 3 },
    greathall: { image: "", video: "", opacity: 0.16, blur: 3 },
    wishwell: { image: "", video: "", opacity: 0.14, blur: 3 },
    finale: { image: "/photos/hogwarts-night.jpg", video: "", opacity: 0.1, blur: 4 },
  },

  // 🔎 SEO / META
  meta: {
    title: "Özür Dilerim",
    description:
      "Hogwarts evreninde geçen sinematik bir yıldönümü deneyimi. Yalnızca seçilmiş cadılar için hazırlanmış büyülü bir aşk hikayesi.",
    keywords: ["Harry Potter", "Hogwarts", "yıldönümü", "aşk", "sinematik deneyim"],
  },

  // ⏳ YÜKLEME EKRANI
  loader: {
    text: "Hogwarts seni bekliyor...",
  },

  // 🔐 GİRİŞ KAPISI ( şifre .env.local → SITE_PASSWORD )
  gate: {
    backgroundImage: "/photos/hogwarts-night.jpg",
    title: "Hogwarts Özel Giriş Kapısı",
    subtitle: "Bu büyü sadece bir şifreyle açılabilir, ve sen onu biliyorsun...",
    placeholder: "Büyülü rakamları sırala",
    buttonLabel: "Kapıyı Aç · Alohomora",
    loadingLabel: "Büyü çözülüyor...",
    errorMessage: "Bu büyü sana ait görünmüyor.",
    welcome: "Hogwarts'a Hoş Geldin",
  },

  // 🦉 BAYKUŞ TESLİMATI (girişten sonra ara sahne)
  owl: {
    line: "Bir baykuş sana doğru kanat çırpıyor...",
    delivered: "Sana bir mektup bıraktı.",
  },

  // ── MEKTUP ──────────────────────────────────────────────────────────────
  letter: {
    eyebrow: "Hogwarts Kabul Mektubu",
    sealHint: "Mührü kırmak için dokun",
    title: "Hogwarts Cadılık ve Büyücülük Okulu",
    greeting: "Sevgili {name},",
    body:
      "Hogwarts seni özel bir göreve çağırıyor. Yıldızlar bu gece yalnızca senin için diziliyor; mumlar senin adına yanıyor. Birlikte yazdığımız hikâyenin en büyülü bölümlerini keşfetmek üzere kapılar ardına kadar açıldı.",
    signature: "Sonsuza dek seninle... -Ersan.",
    buttonLabel: "Yolculuğa Başla",
  },

  // ── BÜYÜK SALON / SEÇİM TÖRENİ ───────────────────────────────────────────
  sorting: {
    eyebrow: "Büyük Salon · Seçim Töreni",
    title: "Büyük Salon",
    subtitle: "Yıldız tozları arasında, Seçmen Şapka senin için fısıldıyor.",
    startLabel: "Şapkayı Giy",
    hatLines: [
      "Hımm... inatçı bir ruh.",
      "Cesaret görüyorum, hem de bolca...",
      "Sadık bir kalp, keskin bir akıl...", 
      "Evet... artık eminim...",
    ],
  },

  // ── ÇAPULCU HARİTASI ─────────────────────────────────────────────────────
  map: {
    eyebrow: "Çapulcu Haritası",
    title: "Yaramazlık Yapıldı",
    subtitle: "Mürekkep rotasını takip et. Her durak, birlikte attığımız bir adım.",
    // Sıra önemlidir — rota bu sırayla çizilir
    stops: [
      { id: "first-message", title: "İlk Mesaj", date: "", location: "Esperanza Discord", icon: "✉", story: "İlk mesajımı atarken buraya geleceğimi gösterseler gülerdim. Hatta bazen hâlen inanamadığım şeyler bunlar...", photo: "/photos/first-message.jpg", video: "" },
      { id: "first-meet", title: "İlk Tanışma", date: "", location: "Viyana Kahvesi", icon: "✦", story: "Burası başkaları için sıradan bi kahveci, bizim için ise hikâyenin başladığı yer. Not: Lavaboya gittiğimde kızlara attığın mesajı unutmadım :Dd", photo: "/photos/first-meet.jpg", video: "" },
      { id: "first-date", title: "İlk Sarılmamız", date: "", location: "Moda Sahil", icon: "☕", story: "Şu kare için ne kadar sabrettiğimi bilemezsin. Sanırım bazı şeyler olması gerektiğinde oluyor.", photo: "/photos/ilksarilma.jpg", video: "" },
      { id: "first-photo", title: "İlk Hediyen", date: "", location: "İsmini hatırlamadığım kartaldaki favori mekanımız.", icon: "📷", story: "Beni geç, kedimi dahi düşünen birini nasıl sevmem ki?", photo: "", video: "/photos/ilkhediyen.mp4" },
      { id: "first-trip", title: "İlk Seyahat", date: "", location: "Kocaeli Besyo Parkuru", icon: "🧳", story: "Birlikte ilk uzun yolculuğumuz. Hem de o kadar kısıtlı imkanlara rağmen. Senin için zor bi gündü biliyorum, ama en zor gününde dahi yanında olacağımı bil.", photo: "", video: "/photos/ilkseyahat.mp4" },
      { id: "first-anniversary", title: "İlk Yıldönümü", date: "21.06.2025", location: "", icon: "❤", story: "Ve... bu da bir yıl sonrası. Fotoğraf çekilmeyi sevmeyen beni bile seninle aynı karede olmayı sevdirdin. Tebrikler!", photo: "/photos/yildonumu.jpg", video: "" },
    ] as MapStop[],
  },

  // ── DÜŞÜNCE HAVUZU (PENSIEVE) ────────────────────────────────────────────
  pensieve: {
    eyebrow: "Düşünce Havuzu",
    title: "Anıların Gümüş Akışı",
    subtitle: "Parmaklarını gümüş sıvıya daldır; her anı havuzdan yükseliyor.",
    hint: "Havuza dokun",
    memories: [
      { src: "/photos/m1.jpg", video: "", title: "Nah Çekme Hastalığı", caption: "Her güzelin bi kusuru varmış işte napalım JMSALKFNZLXF (yanlış anlaşılmasın senden başka güzel görmedim.)", date: "" },
      { src: "/photos/m2.jpg", video: "", title: "Tablo..", caption: "Senin içine pek sinmese de benim için anlamı çok büyük.", date: "" },
      { src: "/photos/m3.jpg", video: "", title: "...", caption: "Sana acılarımı anlattım, hepsini sabırla dinledin...", date: "" },
      { src: "/photos/m4.jpg", video: "", title: "En Zor Anlarımda Bile", caption: "Sakat kalma ihtimalim varken bile yanımdaydın.", date: "" },
      { src: "/photos/m5.jpg", video: "", title: "Aile.", caption: "Onlarla tanışması gereken tek kişiydin.", date: "" },
      { src: "/photos/m6.jpg", video: "", title: "MAL", caption: "Bazen benim yüzümden böyle mal arkadaşlara katlandın. Sağlık olsun. Böyle infulinsırın gaizatını s", date: "" },
      { src: "", video: "/photos/m7.mp4", title: "♥︎", caption: "Hayatımdaki her şey seninle güzel, sen de benim güzelimsin.", date: "" },
    ] as Photo[],
  },

  // ── PATRONUS ─────────────────────────────────────────────────────────────
  patronus: {
    eyebrow: "Patronus",
    intro: "Karanlık çöküyor... sis yoğunlaşıyor...",
    castLabel: "Expecto Patronum",
    message: "En karanlık zamanlarda bile bana ışık oldun.",
    submessage: "Hp'den çok anlamam ama orda patronus varmış. Sen de benim Patronus'umsun; her zorlukta sadece senin sevgin beni güçlü kılabilir..",
  },

  // ── KEHANET SALONU ( Gizemler Dairesi · Prophecy Hall ) ──────────────────
  //  Geleceğe dair büyülü kehanetler. Her tıklamada farklı bir kehanet çıkar.
  prophecy: {
    eyebrow: "Gizemler Dairesi",
    title: "Kehanet Salonu",
    subtitle: "Kürenin içindeki sis dağılıyor... geleceğimize dair bir kehanet beliriyor.",
    approach: "Küreye dokun",
    again: "Yeni Bir Kehanet",
    prophecies: [
      "Birlikte göreceğiniz en güzel gün henüz gelmedi.",
      "Yıllar sonra bile bugünleri gülümseyerek hatırlayacaksınız.",
      "Yolunuz uzun ama yan yana yürümeye devam edeceksiniz.",
      "Birlikte çıkacağınız yeni bir macera sizi bekliyor.",
      "En güzel bölüm henüz yazılmadı.",
      "Bu hikâye okuduğunuz tüm romanlardan çok daha uzun sürecek.",
    ],
  },

  // ── DİLEK KUYUSU ( Kara Göl kıyısı · ortak hayaller ) ────────────────────
  //  Her yıldız bir ortak hayali temsil eder. Hepsini kuyuya bırak.
  wishWell: {
    eyebrow: "Dilek Kuyusu",
    title: "Hayallerimiz",
    subtitle: "Her yıldız, birlikte kurduğumuz bir hayal. Onları kuyuya bırak, gökyüzüne emanet et.",
    dreams: [
      { icon: "🌍", text: "Birlikte kamp tatilleri." },
      { icon: "🎉", text: "Yeni yıldönümleri kutlamak" },
      { icon: "🏡", text: "Aynı evde yaşamak" },
      { icon: "👵", text: "Birlikte yaşlanmak" },
      { icon: "📸", text: "Yeni anılar biriktirmek" },
      { icon: "✨", text: "Hayallerimizi gerçekleştirmek" },
    ],
    finaleMessage: "Hayallerimiz artık gökyüzüne emanet.",
    constellation: "Hayallerimiz gökyüzüne, sen bana.",
  },

  // ── ZAMAN KAPSÜLÜ ( İhtiyaç Odası yerine ) ───────────────────────────────
  capsule: {
    eyebrow: "Zaman Kapsülü",
    title: "Mühürlü Sandık",
    subtitle: "Büyüyle mühürlenmiş bu sandık, yalnızca senin dokunuşunla açılır.",
    openLabel: "Mühre Dokun",
    items: [
      { id: "c1", kind: "letter", title: "Eski Bir Mektup", body: "Seni tanımadan önceki hayatımı hatırlamıyorum bile. Sanki hep buradaydın.", photo: "" },
      { id: "c2", kind: "photo", title: "Saklı Bir Fotoğraf", body: "Bu anı çekerken bilmiyordum; yıllar sonra hâlâ aynı şekilde gülümseteceğini.", photo: "/photos/capsule-1.jpg", video: "" },
      { id: "c3", kind: "parchment", title: "Bir Parşömen", body: "O gün tek dileğim bunun bitmemesiydi. Sanırım çoktan kabul oldu.", photo: "" },
      { id: "c4", kind: "note", title: "Geleceğe Not", body: "Yıllar sonra bunu okuduğunda bil ki, o gün de bugünkü kadar sevdim seni.", photo: "" },
    ] as CapsuleItem[],
    finaleMessage: "Bunu okuduğun gün de seni ilk günkü kadar seviyorum.",
    sealedLine: "21.06.2025 tarihinde mühürlendi.",
  },

  // ── BÜYÜK SALON (FİNAL ÖNCESİ HAZIRLIK) ──────────────────────────────────
  greatHallFinale: {
    messages: ["21.06.2025", "Bir yıl geçti.", "Ama hikâye yeni başlıyor."],
  },

  // ── PATRONUS MEKTUBU (finale yakın) ──────────────────────────────────────
  //  Bu mektubu kendin doldur — uzun, kişisel, parşömen üzerine yazılmış.
  //  Her dizi elemanı ayrı bir paragraf olur. İstediğin kadar paragraf ekle.
  patronusLetter: {
    intro: "Uzakta bir Patronus beliriyor...",
    carry: "Senin için bir mesaj taşıyorum.",
    openLabel: "Mesajı Aç",
    title: "Sana, Yalnızca Sana",
    greeting: "Hayatımın en kıymetlisine,",
    paragraphs: [
      "Siteyi hızlıca bitirmiş olsak da buraya kadar kolay gelmediğimizin farkındayım. Tam 1 yıl. Kavgalar, gürültüler, yanlış anlamalar...",
      "Ama hepsinde yanyana olmayı başardık. Bence bizim de 'olağanüstü' gücümüz budur ne dersin? Hp'de olamasak da gerçek hayatta.",
      "Biliyorsun yazmaya başladığımda buraya sığdıramam. Fakat bir gün en sevdiğin şarkıyı açıp kamp ateşinin önünde gözlerine bakarken anlatırım tüm hislerimi. Sen de dinlersin hatta belki çocuklarımız da. Seni son nefesime dek sevicem. İyi ki benimsin. Not: Çocuk olmasa da olur siktir et :D",
    ],
    sign: "— {you}",
  },

  // ── BÜYÜK FİNAL ──────────────────────────────────────────────────────────
  finale: {
    // Yıldızlardan oluşan yazı
    starName: "Kodlarım bitti, Hikayemiz değil.",
    line1: "Bu sadece ilk senemiz. En sevdiğin dizinin ilk sezonu gibi. Tek bir farkla, bizimkinin sonu toprakta.",
    line2: "Birlikte yazacağımız daha çok bölüm var.",
    // 👉 KENDİ KAPANIŞ MESAJIN — buraya 5-10 satır ekleyebilirsin.
    //    Her dizi elemanı ekranda sırayla, tek tek belirir. İstediğin kadar ekle/çıkar.
    extraLines: [
      "Seninle geçen her an, bir büyüden daha gerçek.",
      "Ve yazacağımız her yeni sayfa, bir öncekinden daha güzel olacak.",
    ],
    closing: "PERDE KAPANDI.",
    // Gizli mektup (en sona ulaşana özel)
    hiddenHint: "Gizli bir büyü izi parlıyor... Belki burda seni bekleyen son bir mesaj vardır..",
    hiddenTitle: "Gizli Mektup",
    hiddenBody:
      "Buraya kadar geldin. Tıpkı hayatımda yaptığın gibi; sonuna kadar, sabırla, sevgiyle. Bu site bir gün eskiyecek ama sana olan sevgim hiç eskimeyecek. Seni çok seviyorum — dünün, bugünün ve bütün yarınların için.",
  },

  // 🦌 EASTER EGG (değnek menüsündeki gizli kart)
  easterEgg: {
    icon: "🦌",
    title: "Expecto Patronum",
    quote:
      "“Işıklar ne kadar sönük olursa olsun, mutluluk her zaman bulunabilir; yeter ki ışığı yakmayı hatırla.”",
    sign: "— Seni her karanlıkta bulurum.",
  },
};

export type SiteConfig = typeof config;
