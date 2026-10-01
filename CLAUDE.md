# Klinavi – Proje Bağlamı

Klinavi, hastane ziyaretçilerinin kendi telefonlarıyla QR kod okutup gidecekleri istasyona (Station) adım adım yönlendirildiği bir web uygulaması. Proje sahibi Zafer, Kepler Universitätsklinikum Neuromed Campus'ta (Linz) Portier bölümünün sorumlusu. Uygulama başlangıçta bu kampüs için geliştiriliyor.

## Temel kararlar
- **Uygulama dili: sadece Almanca.** Ziyaretçiye görünen bütün metinler Almanca. Zafer ile iletişim Türkçe.
- **İsim: Klinavi** (Klinik + Navigation). Logo: içinde "v" harfi olan bir konum pini. Marka ve domain kontrolü (see.ip / TMview, klinavi.at / klinavi.app) henüz yapılmadı.
- **Kurulum yok:** Tek HTML dosyası, harici backend yok. QR kod `https://<adres>/#s-<nodeId>` adresini açıyor, başlangıç noktası buradan geliyor.
- **Kişisel veri yok:** Takip, giriş veya sunucu tarafında kayıt yok. Sensör verisi telefondan çıkmıyor (DSGVO).
- **Bina içinde GPS yok.** Konum QR kodundan geliyor. "Mitlaufen" modu adım sayıp rota üzerinde ilerliyor (PDR). Bluetooth beacon'lar sonraki aşama için bir seçenek, ama native uygulama gerektiriyor.
- **İki teslimat:** `dist/demo` isimsiz bir örnek hastane (paylaşılabilir). `dist/neuromed` hastanenin adını ve planını içeriyor. Herkese açık yayınlamadan önce hastanenin onayı gerekiyor.

## Dosyalar
- `src/app.html` – Uygulamanın tamamı (CSS + JS). Head ve body etiketleri yok, `build.py` ekliyor.
- `src/neuromed/nmc-data.js` – Neuromed Campus'un düğüm ve kenar verisi (`window.NMC=true`, `nmcData()`).
- `src/neuromed/campus-plan.jpg` – KUK'un resmi kampüs planı (Gebäudeplan, 1600 px).
- `build.py` – `python3 build.py` komutu `dist/demo/index.html` ve `dist/neuromed/index.html` dosyalarını üretiyor. Neuromed sürümünde plan base64 olarak gömülü, `/*NMC-SLOT*/` yerine veri ekleniyor.
- **`dist/` dosyalarını elle düzenleme**, her zaman `src/` içinde değiştirip build et.

## Uygulamanın yapısı (src/app.html)
Üç görünüm var, üst sekmelerle geçiliyor:
1. **Besucher:** "Sie sind hier" levhası, arama, kategorili hedef listesi → rota: kat planında turuncu rota, adım listesi, Zurück/Weiter.
2. **Plan-Editor:** Kat planı fotoğrafı yükleme, noktaları tıklayarak ekleme (Gang, Ziel, Aufzug/Stiege, Eingang), bağlama, silme, sürükleme. JSON olarak dışa/içe aktarma. localStorage'da taslak olarak saklanıyor.
3. **QR-Codes:** Eingang, Aufzug ve `qr:true` olan her nokta için QR kartı (qrcodejs 1.0.0, cdnjs). Temel adres girilebiliyor.

### Veri modeli
```
{ name, floors:[{id,name,short,image?,h?,scale?}],
  nodes:[{id,f,x,y,t, name?,cat?,info?,lab?,qr?,badge?,bau?,where?,then?,tag?,start?}],
  edges:[[idA,idB],...] }
```
- `t`: `g` Gang-Punkt, `z` Ziel, `l` Aufzug/Stiege, `e` Eingang (başlangıç noktası, aynı zamanda hedef).
- Koordinatlar: Genişlik 1000 birim, yükseklik `h` (varsayılan 620). `scale` = birim başına metre (varsayılan 0.08, Neuromed kampüsü 0.5).
- **Katlar arası bağlantı:** Aynı isimli `l` düğümleri komşu katlarda otomatik bağlanıyor (maliyet 300).
- `cat`: Station | Ambulanz | Gebäude | Anreise | Service.
- `then`: Kampüs seviyesinden sonra bina içindeki son adımın metni ("Im Gebäude").
- `badge:{t,c}`: Listede kat rozeti yerine bina harfi ve rengi.

### Rota mantığı
- Dijkstra (`shortest`) → `makeSteps`: Aynı kattaki düz bölümler birleştiriliyor, dönüş açısı çapraz çarpımla hesaplanıyor (ekran koordinatlarında pozitif = sağ). Eşikler 25° / 60° / 150°.
- Adım türleri: `turn` (Losgehen/abbiegen/Aussteigen), `lift`, `arrive`, `inside`.
- Son kısa bölüm (<220 birim) varış adımına dönüşüyor: "liegt auf der rechten/linken Seite".

### Mitlaufen (adım sayarak ilerleme)
- `devicemotion`: İvme büyüklüğü, EMA ile yumuşatılıyor (0.5), taban EMA 0.98. Eşik +0.9 m/s² yukarı, +0.2 aşağı, adımlar arası en az 320 ms.
- Adım uzunluğu 50 / 65 / 75 cm, localStorage `klinavi-step`.
- Kalan mesafe ≤5 m veya %85 → titreşim ve "Gleich rechts abbiegen".
- **Otomatik geçiş:** Pusula (`deviceorientationabsolute` veya `webkitCompassHeading`) bacak başlangıcına göre beklenen yönde ≥45° dönünce (en az %60 ilerlemişken) ya da %115 ilerleme olunca. Pusula yoksa %100'de geçiyor.
- Asansörde duruyor, "Weiter" bekliyor. Varışta uzun titreşim ve mod kapanıyor.
- iOS: `DeviceMotionEvent.requestPermission()` tıklama içinde çağrılıyor. Wake Lock deneniyor.
- "Gehen simulieren": Her 450 ms'de bir adım. Asansörde 2.5 sn bekleyip devam ediyor (sensörsüz test ve sunum için).
- Sensörler sadece gerçek bir HTTPS adresinde çalışıyor (claude.ai önizlemesinde engelli).

## Neuromed Campus verisi (taslak – Zafer'in doğrulaması gerekiyor)
- Adres: Wagner-Jauregg-Weg 15, 4020 Linz. Binalar: AZ, B (giriş holü, sarı), C, D, G, H, I (Kindergarten), J, K, L, M, N, R, V.
- Girişler: Haupteingang Nord (B, Ein-/Ausstiegszone), Haupteingang Süd (AZ), Eingang D Nord. Otobüs 41/43 "Wagner-Jauregg-Weg", otoparklar Batı / Kuzey / Güney.
- İstasyonlar (KUK Neurologie/Psychosomatik sayfası): C102 (+ Schlaflabor), C202, C302 (Stroke Unit/IMCU, EMU), N104 Tagesklinik, N204 Akutnachsorge, D101, D102.
- **Varsayımlar:** Kat bilgisi istasyon kodundan çıkarıldı (C302 = Bau C, 3. Stock). Yürüme yolları ve bina girişleri plana bakarak tahmin edildi. Örneğin Güney girişten rota Bau K'nın içinden geçiyor. Mesafeler kaba tahmin.

## Sıradaki adımlar
1. Zafer gerçek telefonla test edecek: Cloudflare Pages'e `dist/neuromed` yüklenip koridorda Mitlaufen denenecek. Adım sayma eşikleri ve adım uzunluğu sonuçlara göre ayarlanacak.
2. C, D ve N binalarının ziyaretçi girişleri ve binalar arası iç bağlantılar netleşecek, `nmc-data.js` düzeltilecek.
3. Binaların içi: Fluchtwegplan fotoğraflarıyla kat planları eklenecek ("Im Gebäude" adımı gerçek rotaya dönüşecek).
4. İleride düşünülebilecekler: PWA (manifest + offline), barrierefrei rota seçeneği (sadece asansör), çok dilli destek (şu an sadece Almanca), yönetim sunumu.

## Çalışma şekli
- Zafer adım adım ve "test et, sonra devam et" yaklaşımını tercih ediyor.
- Her değişiklikten sonra `python3 build.py` çalıştır. Önemli değişikliklerde Playwright ile test et (rota adım metinleri, simülasyon baştan sona).
