import type { Topic } from "@/types";

const dom = (field: string) =>
  `Nội dung thuộc lĩnh vực ${field}. Viết với góc nhìn và hiểu biết của người am hiểu ${field}, dùng ví dụ, thuật ngữ và ngữ cảnh phù hợp với ${field}.`;

export const TOPICS: Topic[] = [
  { id: "cooking", name: "Nấu ăn / Ẩm thực", emoji: "🍳", promptFragment: dom("nấu ăn – ẩm thực") },
  { id: "family", name: "Gia đình", emoji: "👨‍👩‍👧", promptFragment: dom("gia đình – hôn nhân") },
  { id: "beauty", name: "Làm đẹp", emoji: "💄", promptFragment: dom("làm đẹp – chăm sóc da/tóc") },
  { id: "travel", name: "Du lịch", emoji: "🧳", promptFragment: dom("du lịch – trải nghiệm điểm đến") },
  { id: "parenting", name: "Nuôi dạy con", emoji: "🍼", promptFragment: dom("nuôi dạy con – chăm sóc trẻ") },
  { id: "health", name: "Sức khỏe", emoji: "🩺", promptFragment: dom("sức khỏe – lối sống lành mạnh") },
  { id: "fitness", name: "Thể thao / Gym", emoji: "🏋️", promptFragment: dom("thể hình – luyện tập") },
  { id: "finance", name: "Tài chính cá nhân", emoji: "💰", promptFragment: dom("tài chính cá nhân – tiết kiệm/đầu tư") },
  { id: "business", name: "Kinh doanh / Khởi nghiệp", emoji: "📈", promptFragment: dom("kinh doanh – khởi nghiệp") },
  { id: "tech", name: "Công nghệ", emoji: "💻", promptFragment: dom("công nghệ – thiết bị/phần mềm") },
  { id: "education", name: "Giáo dục / Học tập", emoji: "📚", promptFragment: dom("giáo dục – học tập") },
  { id: "selfdev", name: "Phát triển bản thân", emoji: "🧠", promptFragment: dom("phát triển bản thân – tâm lý") },
  { id: "fashion", name: "Thời trang", emoji: "👗", promptFragment: dom("thời trang – phối đồ") },
  { id: "home", name: "Nhà cửa / Décor", emoji: "🏠", promptFragment: dom("nhà cửa – trang trí/dọn dẹp") },
  { id: "auto", name: "Xe cộ", emoji: "🚗", promptFragment: dom("xe cộ – ô tô/xe máy") },
  { id: "pets", name: "Thú cưng", emoji: "🐶", promptFragment: dom("thú cưng – chăm sóc vật nuôi") },
  { id: "general", name: "Tổng hợp / Khác", emoji: "✨", promptFragment: "Nội dung đa lĩnh vực. Viết chuyên nghiệp, linh hoạt theo chủ đề người dùng đưa ra." },
];

export const getTopic = (id?: string): Topic | undefined =>
  TOPICS.find((t) => t.id === id);
