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
- **⚔️ Nhiệm vụ** — chia môn thành các bài học/chương, tick hoàn thành để nhận
  `+25 XP` mỗi bài.
- **🔥 Streak** — đếm số ngày học liên tục.
- **🏆 Thành tựu** — 10 huy hiệu mở khóa theo cột mốc (streak, số bài, hoàn thành
  môn, đạt cấp...).
- **🗓️ Heatmap** — lưới hoạt động kiểu GitHub thể hiện độ chăm theo từng ngày.
- **🎉 Hiệu ứng** — banner ăn mừng khi lên cấp hoặc mở khóa thành tựu.

## 🚀 Chạy thử

```bash
npm install
npm run dev      # mở http://localhost:5173
```

Build production:

```bash
npm run build
npm run preview
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
