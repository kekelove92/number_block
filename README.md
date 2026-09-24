# 🟥🟧🟨 Numberblocks Magic Lab 🟩🟦🟪
### Ứng Dụng Học Toán & Tiếng Anh Tương Tác Chuẩn Series Phim Numberblocks (BBC / CBeebies)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Web Audio API](https://img.shields.io/badge/Web%20Audio%20API-00B4D8?style=for-the-badge&logo=web-audio-api&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Pedagogy](https://img.shields.io/badge/Curriculum-BBC%20Numberblocks-red?style=for-the-badge)](#)

---

## 🌟 Giới Thiệu Dự Án

**Numberblocks Magic Lab** là ứng dụng giáo dục mầm non và tiểu học (Lớp 1), biến các con số khô khan thành **những sinh vật hình khối sống động, biết chớp mắt, nhảy múa, nói tiếng Anh và tương tác thực tế**. 

Dự án bám sát **100% quy chuẩn tạo hình, tính cách và triết lý sư phạm của đài truyền hình giáo dục BBC / CBeebies (Anh Quốc)**, giúp trẻ trực quan hóa hoàn toàn khái niệm về:
* **Bản chất số học:** Số lượng là số lượng khối lập phương cấu thành.
* **Hình học tự nhiên của số:** Số chính phương là hình vuông ($2 \times 2$, $3 \times 3$), số chẵn là hình chữ nhật đôi ($2 \times 3$, $2 \times 4$, $2 \times 5$).
* **Phép cộng:** Là hai bạn Numberblock chạy lại gần nhau, ôm lấy nhau và "hóa thân" thành bạn số lớn hơn.
* **Phép trừ:** Là một bạn Numberblock "hắt xì" hoặc tách đôi thành các bạn số nhỏ hơn.

---

## 🎨 Bảng Tạo Hình Chuẩn 100% Của Numberblocks 1 - 10

| Số | Nhân vật | Cấu trúc khối | Đặc điểm nhận dạng & Lời thoại thương hiệu |
| :---: | :---: | :---: | :--- |
| **1** | **One** | $1 \times 1$ (1 khối đỏ) | 1 mắt to tròn ở giữa. *"I am One! Whole and handsome One!"* |
| **2** | **Two** | $1 \times 2$ (cột đứng 2 cam) | Đeo kính màu tím, bước chân khiêu vũ. *"One and another one makes Two!"* |
| **3** | **Three** | $1 \times 3$ (cột đứng 3 vàng) | 3 quả bóng xiếc đỏ-xanh-lá trước ngực. *"Look at me, I am Three! Ta-da!"* |
| **4** | **Four** | $2 \times 2$ (hình vuông xanh lá) | **Siêu sao hình vuông**, 2 lông mày hình chữ nhật. *"I am Four, and I love being a square!"* |
| **5** | **Five** | $1 \times 5$ (cột đứng 5 xanh dương) | Ngôi sao xanh trên mắt phải, bàn tay 5 ngón. *"High Five! Five alive!"* |
| **6** | **Six** | $2 \times 3$ (khối chữ nhật tím) | **Khối xúc xắc 2 cột $\times$ 3 hàng**, thích gieo xúc xắc và làm thơ. *"Six in the mix! Roll the dice!"* |
| **7** | **Seven** | $1 \times 7$ (cột đứng 7 màu cầu vồng) | Rực rỡ 7 sắc cầu vồng, đại diện cho may mắn. *"Lucky Seven! Rainbow colours shining bright!"* |
| **8** | **Eight** | $2 \times 4$ (khối chữ nhật hồng) | **Siêu anh hùng Octoblock**, mặt nạ tím bí ẩn. *"Octoblock to the rescue! Eight tentacles ready!"* |
| **9** | **Nine** | $3 \times 3$ (hình vuông xám xanh) | **Hình vuông lớn kỳ diệu**, hay hắt xì tách thành 3 bạn Three. *"Nine! Three times three square!"* |
| **10** | **Ten** | $2 \times 5$ (khung 10 ô trắng viền đỏ) | **Khung Mười Ô (Ten-Frame)**, vương miện ngôi sao tỏa sáng. *"Ten! A wonderful Ten! Two fives together!"* |

---

## 🚀 Các Tính Năng Nổi Bật

### 1. Kéo Thả & Gộp Phép Cộng (Snap & Merge)
- Trẻ dùng tay (hoặc chuột) kéo 2 bạn Numberblock lại gần nhau.
- Khoảng cách chạm sẽ kích hoạt hiệu ứng từ tính (magnetic snap), hào quang ánh sáng bao quanh và hợp thể kèm âm thanh bừng sáng (victory chime).
- Khối mới tạo lập tức nở nụ cười và đọc to câu thoại tiếng Anh đại diện.

### 2. Tách Đôi Phép Trừ (Canonical Splitting & Slicing)
- Chuyển sang công cụ **Split ✂️** hoặc **nhấp đúp chuột** vào bất kỳ Numberblock nào:
  - Khối **4** tách thành đúng hai bạn **2** đeo kính cam ($4 - 2 = 2$).
  - Khối **6** tách thành đúng hai bạn **3** tung hứng vàng ($6 - 3 = 3$).
  - Khối **10** tách thành đúng hai bạn **5** có sao xanh ($10 - 5 = 5$).
- Kéo bất kỳ khối nào thả vào **Thùng Rác 🗑️** ở góc phải để trừ bớt khối khỏi sân chơi.

### 3. Chế Độ Đếm Từng Khối (Count Mode 🔢)
- Chạm vào công cụ **Count**, sau đó chạm vào từng khối lập phương con bên trong một nhân vật.
- Từng ô sẽ sáng rực lên theo thang âm mộc cầm (xylophone pitch scale: Do - Re - Mi...) và giọng đọc đếm lần lượt *"One, Two, Three..."*.

### 4. Bản Đồ 10 Bài Học Toán Lớp 1 (10-Lesson Roadmap)
Hệ thống giáo trình tích hợp 10 bài học chuẩn theo tiến trình phát triển tư duy của trẻ:
1. **Bài 1:** Gặp Gỡ 1 Đến 5 (Nhận diện số lượng và mặt số).
2. **Bài 2:** Bậc Thang Số Học Cộng 1 (Step Squad: $n + 1$).
3. **Bài 3:** Cặp Đôi Tự Nhiên (Double Trouble: $1+1=2, 2+2=4$).
4. **Bài 4:** Khối Vuông Kì Diệu (The Square: Tìm hiểu số 4 hình vuông $2 \times 2$).
5. **Bài 5:** Xúc Xắc Số 6 ($3+3=6$ khối chữ nhật xúc xắc).
6. **Bài 6:** Siêu Nhân Octoblock ($4+4=8$ siêu anh hùng).
7. **Bài 7:** Cầu Vồng May Mắn Số 7 (Khám phá 7 màu sắc).
8. **Bài 8:** Bạn Thân Của Mười (Number Bonds to 10: $9+1, 8+2, 7+3, 6+4, 5+5$).
9. **Bài 9:** Phép Trừ Là Tách Khối (Học trừ bằng thao tác cắt đôi).
10. **Bài 10:** Thử Thách Đại Bậc Thang (Tạo kim tự tháp số học từ 1 đến 10).

---

## 🛠️ Công Nghệ & Tối Ưu Hiệu Năng

- **Không dùng thư viện cồng kềnh:** 100% Vanilla HTML5, CSS3 và Modern JavaScript (ES6+).
- **Trải nghiệm mượt mà 60/120 FPS:**
  - Định vị kéo thả tối ưu bằng `transform: translate3d(...)` và phần cứng GPU.
  - Ngăn ngừa hoàn toàn hiện tượng giật hình (Layout Thrashing) trong chu kỳ `pointermove`.
  - Hỗ trợ toàn diện cảm ứng đa điểm cho iPad, Tablet và màn hình tương tác thông minh (`touch-action: none`).
- **Âm thanh tổng hợp tự động (Web Audio API):**
  - Tự động sinh sóng hài tự nhiên cho đàn Marimba, Xylophone, tiếng nảy pop bong bóng và hợp âm chiến thắng mà không cần phụ thuộc các file audio MP3 nặng nề.
  - Tích hợp `SpeechSynthesis` phát âm chuẩn giọng tiếng Anh bản ngữ cho trẻ.

---

## 📂 Cấu Trúc Thư Mục

```text
├── index.html                           # Giao diện chính, HUD nhiệm vụ & Modal bài học
├── style.css                            # Hệ thống token màu sắc HSL, lưới CSS & animations
├── numberblocks.js                      # Class NumberBlock & quy chuẩn tạo hình 1 - 10
├── app.js                               # Logic tương tác kéo thả, kiểm tra nhiệm vụ & bài học
├── audio.js                             # Bộ tổng hợp âm thanh Web Audio API & phát âm
├── CURRICULUM_SHAPE_MATH.md             # Giáo trình sư phạm tạo hình toán học chuẩn BBC
├── GIAO_AN_TOAN_LOP_1_NUMBERBLOCKS.md   # Kế hoạch bài dạy chi tiết 10 bài học toán lớp 1
└── .agents/                             # Quy chuẩn kỹ thuật & kiểm định chất lượng (QA)
```

---

## 💻 Hướng Dẫn Cài Đặt & Chạy Trực Tiếp

Dự án là ứng dụng Web tĩnh (Static Web App), bạn có thể chạy ngay mà không cần cài đặt Node.js hay build:

### Cách 1: Chạy trực tiếp qua trình duyệt
1. Clone repository về máy:
   ```bash
   git clone https://github.com/kekelove92/number_block.git
   ```
2. Mở tệp `index.html` bằng bất kỳ trình duyệt nào (Chrome, Edge, Safari, Firefox).

### Cách 2: Chạy với máy chủ cục bộ (Khuyên dùng)
```bash
# Sử dụng Python có sẵn:
python -m http.server 8080

# Hoặc sử dụng Node npx serve:
npx serve .
```
Truy cập địa chỉ: `http://localhost:8080` trên trình duyệt.

---

## 📜 Bản Quyền & Nguồn Tham Khảo
* Dự án được phát triển nhằm mục đích phi thương mại, phục vụ nghiên cứu và đổi mới phương pháp giảng dạy toán học trực quan cho trẻ em.
* Nguồn cảm hứng nhân vật và âm thanh: Series truyền hình giáo dục **Numberblocks** thuộc sở hữu của **Alphablocks Ltd / Blue-Zoo Productions / BBC (CBeebies)**.
