# Content Support

Web app tạo & quản lý nội dung AI cho xây kênh cá nhân (Tạo Content · Concept viral · Chất liệu bản thân · Kịch bản video HILLA) với giao diện **Modern Light UI** (Indigo).

> Next.js 16 (App Router, TS) · Tailwind v4 + shadcn UI · Firebase (Auth / Firestore / Storage) · Vercel AI SDK + Google Gemini · Framer Motion.

## ✨ Tính năng

- **Auth** — Email/Password + Google OAuth, Auth Guard bảo vệ toàn bộ khu vực nội bộ, tự tạo `users/{uid}`.
- **Tạo Content AI** — chọn Persona + Concept + tông giọng + độ dài, **streaming thời gian thực**, xem trước Markdown, Lưu / Sao chép / Xuất `.md`.
- **Chatbot cá nhân** — tạo trợ lý riêng, nạp Knowledge Base (PDF/TXT/DOCX hoặc dán text), tùy chỉnh System Prompt, khung chat test trực tiếp.
- **Dashboard** — thống kê, bảng + card view, lọc theo trạng thái/concept, tìm kiếm, sửa/xoá/đổi trạng thái.

## 🚀 Bắt đầu

### 1. Cài đặt

```bash
npm install
```

### 2. Cấu hình biến môi trường

Sao chép `.env.example` → `.env.local` rồi điền giá trị:

```bash
cp .env.example .env.local
```

| Nhóm | Lấy ở đâu |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Console → Project Settings → General → Your apps (Web) |
| `FIREBASE_PROJECT_ID` | Cùng project id ở trên (dùng để verify ID token phía server) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | **Miễn phí** tại https://aistudio.google.com/apikey |

> ✅ **Không cần Firebase Admin / service account.** API route xác thực Firebase ID token bằng khoá công khai (JWKS) của Google, nên chỉ cần config client + Gemini key là chạy.

### 3. Bật dịch vụ Firebase

Trong Firebase Console:

1. **Authentication** → bật *Email/Password* và *Google*.
2. **Firestore Database** → tạo database.
3. Triển khai rules & indexes (cần Firebase CLI):

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

(hoặc dán thủ công `firestore.rules`; Firestore sẽ nhắc tạo composite index qua link khi chạy lần đầu.)

### 4. Chạy

```bash
npm run dev
```

Mở http://localhost:3000 → tự chuyển tới `/login`.

## 🗂️ Cấu trúc thư mục

```
app/
  (auth)/            login, register (layout riêng, không sidebar)
  (dashboard)/       dashboard, create, chatbots, settings (Auth Guard + Sidebar)
  api/               generate · chat · ingest  (streaming + parse file)
components/
  ui/                shadcn UI
  layout/            sidebar, header, user-nav
  content/           persona/concept selector, generation-form, markdown, table
  chatbot/           chatbot-form, knowledge-uploader, chat-window
context/AuthContext.tsx
hooks/               use-contents, use-chatbots
lib/                 firebase, auth-helpers (JWKS), ai (Gemini), prompts, personas, concepts, file-parser
types/index.ts
firestore.rules · firestore.indexes.json
```

## 🔒 Mô hình dữ liệu (Firestore)

`users` · `contents` · `chatbots` · `knowledge_documents` — mỗi doc gắn `ownerId`; Security Rules chỉ cho chủ sở hữu đọc/ghi.

## 🧠 Ghi chú RAG

Knowledge Base hiện chạy ở **mức MVP**: text trích xuất được nhồi thẳng vào system prompt (phù hợp tài liệu nhỏ). Muốn xử lý tài liệu lớn, nâng cấp sang chunk + embeddings + vector search.

## 📜 Scripts

```bash
npm run dev     # phát triển
npm run build   # build production
npm run start   # chạy bản build
npm run lint    # eslint
```
