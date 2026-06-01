# 🐉 Gamify My Life — RPG Học Tập

Một web app biến việc học thành một cuộc phiêu lưu nhập vai. Tự thêm môn học của
riêng bạn, hoàn thành từng bài để nhận XP, lên cấp, giữ streak và mở khóa thành
tựu. Tất cả dữ liệu được lưu **ngay trên trình duyệt** (localStorage) — không cần
đăng nhập, không cần server.

## ✨ Tính năng

- **🏰 Sảnh chính (Hero Hub)** — avatar, tổng cấp độ, thanh XP, streak 🔥 và các
  chỉ số tổng quan của bạn.
- **🗺️ Bản đồ môn học** — mỗi môn là một "vùng đất" tự thêm (tên, icon, màu, mục
  tiêu) với cấp độ và tiến trình riêng.
- **⚔️ Nhiệm vụ + XP kiểu game** — chia môn thành bài học/chương với **độ khó**
  riêng, tick hoàn thành để nhận XP được nhân theo phong độ (xem bên dưới).
- **🔥 Streak** — đếm số ngày học liên tục, đồng thời tăng hệ số nhân XP.
- **🏆 Thành tựu** — 10 huy hiệu mở khóa theo cột mốc (streak, số bài, hoàn thành
  môn, đạt cấp...).
- **🗓️ Heatmap** — lưới hoạt động kiểu GitHub thể hiện độ chăm theo từng ngày.
- **🎉 Hiệu ứng** — banner ăn mừng khi lên cấp hoặc mở khóa thành tựu.

## 🎲 Cách tính XP (gamify)

Mỗi khi hoàn thành một bài học:

```
XP nhận = XP gốc (độ khó) × hệ số streak × hệ số combo
```

| Yếu tố | Chi tiết |
|---|---|
| **Độ khó** 🟢🔶🐲 | Thường `10` · Khó `25` · Boss `60` XP gốc, chọn khi thêm bài. |
| **Hệ số streak** ⚡ | <3 ngày `×1` · 3–6 `×1.25` · 7–13 `×1.5` · 14–29 `×1.75` · ≥30 `×2`. |
| **Combo** 🔥 | Hoàn thành nhiều bài trong vòng **10 phút** sẽ chuỗi combo; mỗi bậc `+15%` (tối đa `×2.2`). Quá 10 phút thì combo reset. |

Ví dụ: clear một bài **Boss** khi đang streak 7 ngày và combo 3 →
`60 × 1.5 × 1.30 = 117 XP`. Mỗi lần nhận XP sẽ có toast hiện rõ phép nhân.

> Tiến trình & cấp độ của từng **môn** dựa trên XP gốc (không tính bonus) nên
> luôn ổn định; còn cấp độ **nhân vật** thì hưởng trọn XP đã nhân.

## 🚀 Chạy thử

### Cách 1 — Không cần cài gì (khuyên dùng nếu chưa có máy/dev tools)

Mở thẳng file **[`gamify.html`](gamify.html)** bằng trình duyệt (nhấp đúp là chạy).
Đây là bản port một-file, dùng JavaScript thuần, **không cần `npm`, không cần
mạng, không cần server** — chạy offline hoàn toàn và vẫn lưu tiến trình trong
localStorage của trình duyệt.

> ⚠️ Bản HTML dùng cách tính XP đơn giản (cố định 25 XP/bài). Cơ chế XP kiểu game
> (độ khó · streak · combo) mô tả bên dưới chỉ có ở **bản React**.

### Cách 2 — Bản React (dành cho phát triển tiếp)

```bash
npm install
npm run dev      # mở http://localhost:5173
npm run build    # build production
```

## 🛠️ Công nghệ

- **React 18** + **Vite**
- State + lưu trữ qua React Context và `localStorage`
- CSS thuần (theme tối, gold + tím phép thuật), không dùng thư viện UI

## 📁 Cấu trúc

```
src/
  context/GameContext.jsx   # toàn bộ state, actions, lưu localStorage
  data/badges.js            # định nghĩa thành tựu
  utils/                    # tính XP/level, ngày tháng, thống kê môn
  components/
    HeroHub/                # sảnh chính
    Subjects/               # bản đồ, thẻ môn, chi tiết, modal thêm môn
    Badges/                 # sảnh vinh danh
    Heatmap/                # lưới hoạt động
    Celebration.jsx         # banner lên cấp / thành tựu
    common/                 # ProgressBar, Modal
```

## 💡 Ý tưởng mở rộng (tương lai)

- Timer Pomodoro tính XP theo thời gian học
- Nhiệm vụ hằng ngày (daily quests)
- Biểu đồ XP theo tuần/tháng
- Xuất/nhập dữ liệu (JSON) để sao lưu
- Đồng bộ nhiều thiết bị qua backend
