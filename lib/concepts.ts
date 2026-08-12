import type { Concept } from "@/types";

/** Nhóm concept (bộ concept viral / DNA Viral). */
export const CONCEPT_GROUPS: { id: string; label: string }[] = [
  { id: "value", label: "Giá trị & Thực tiễn" },
  { id: "emotion", label: "Tâm lý & Cảm xúc" },
  { id: "trend", label: "Trend & Thời gian thực" },
  { id: "discover", label: "Khám phá & Độc lạ" },
];

export const CONCEPTS: Concept[] = [
  /* -------------------- Giá trị & Thực tiễn -------------------- */
  {
    id: "compare",
    name: "So sánh / Ẩn dụ",
    emoji: "🔀",
    description: "Đặt hai đối tượng cạnh nhau tạo góc nhìn mới.",
    group: "value",
    promptFragment:
      "Triển khai theo hướng SO SÁNH / LIÊN TƯỞNG / ẨN DỤ: đặt hai đối tượng trái ngược hoặc tương đồng cạnh nhau để làm bật thông điệp, tạo góc nhìn mới lạ.",
  },
  {
    id: "howto",
    name: "Hữu ích thông dụng",
    emoji: "🛠️",
    description: "Hướng dẫn từng bước, mẹo giải quyết vấn đề nhanh.",
    group: "value",
    promptFragment:
      "Triển khai kiểu HỮU ÍCH THÔNG DỤNG: đưa hướng dẫn từng bước, mẹo vặt giải quyết vấn đề nhanh gọn, thực dụng, người đọc áp dụng được ngay.",
  },
  {
    id: "last-minute",
    name: "Lợi ích phút chót",
    emoji: "⏳",
    description: "Dồn phần thưởng hấp dẫn nhất xuống cuối để giữ chân.",
    group: "value",
    promptFragment:
      "Triển khai kiểu LỢI ÍCH PHÚT CHÓT: dồn kết quả/phần thưởng hấp dẫn nhất xuống cuối, gieo tò mò xuyên suốt để giữ chân người đọc tới phút chót.",
  },
  {
    id: "experience",
    name: "Kinh nghiệm thực tiễn",
    emoji: "🧭",
    description: "Kể bài học xương máu, câu chuyện làm nghề.",
    group: "value",
    promptFragment:
      "Triển khai kiểu CHIA SẺ KINH NGHIỆM THỰC TIỄN: kể bài học xương máu / câu chuyện làm nghề của bản thân với chi tiết thật, rồi rút ra bài học ứng dụng được.",
  },
  {
    id: "diy",
    name: "DIY – Tự làm",
    emoji: "🧰",
    description: "Hướng dẫn tự làm với nguyên liệu dễ kiếm.",
    group: "value",
    promptFragment:
      "Triển khai kiểu DIY (TỰ LÀM TẠI NHÀ): hướng dẫn tự làm đồ vật/món ăn với nguyên liệu dễ kiếm, các bước rõ ràng, dễ làm theo.",
  },
  {
    id: "educational",
    name: "Giảng dạy / Kiến thức",
    emoji: "🧠",
    description: "Truyền đạt kiến thức rõ ràng, có cấu trúc.",
    group: "value",
    promptFragment:
      "Kể theo hướng giảng dạy: trình bày có cấu trúc, giải thích khái niệm rõ ràng, kèm ví dụ và điểm mấu chốt dễ nhớ.",
  },
  {
    id: "seo",
    name: "Chuẩn SEO",
    emoji: "🔍",
    description: "Tối ưu tìm kiếm: heading, từ khoá, dễ đọc.",
    group: "value",
    promptFragment:
      "Viết chuẩn SEO: dùng tiêu đề và heading (H2/H3) hợp lý, đưa từ khoá chính một cách tự nhiên, chia đoạn ngắn dễ đọc, có mở đầu thu hút và kết luận rõ ràng.",
  },

  /* -------------------- Tâm lý & Cảm xúc -------------------- */
  {
    id: "emotional",
    name: "Cảm xúc / Hoài niệm",
    emoji: "💭",
    description: "Chạm tới cảm xúc, gợi ký ức và sự đồng cảm.",
    group: "emotion",
    promptFragment:
      "Kể theo hướng cảm xúc và hoài niệm: khơi gợi ký ức, sự ấm áp và đồng cảm, dùng chi tiết nhỏ để chạm tới trái tim người đọc.",
  },
  {
    id: "controversy",
    name: "Gây tranh cãi",
    emoji: "🔥",
    description: "Quan điểm trái chiều kích thích bình luận.",
    group: "emotion",
    promptFragment:
      "Triển khai kiểu GÂY TRANH CÃI / ỨC CHẾ: đưa ra quan điểm trái chiều, đặt vấn đề kích thích bình luận — nhưng giữ văn minh, không xúc phạm cá nhân, không kích động thù ghét.",
  },
  {
    id: "consensus",
    name: "Ủng hộ số đông",
    emoji: "👍",
    description: "Nói lên điều nhiều người đang nghĩ.",
    group: "emotion",
    promptFragment:
      "Triển khai kiểu ỦNG HỘ SỐ ĐÔNG: đứng về phía luồng ý kiến đồng thuận lớn của cộng đồng, khẳng định điều nhiều người đang nghĩ để tạo đồng cảm và chia sẻ.",
  },
  {
    id: "warning",
    name: "Cảnh báo / Sợ hãi",
    emoji: "⚠️",
    description: "Thông tin rủi ro tạo chú ý cấp bách.",
    group: "emotion",
    promptFragment:
      "Triển khai kiểu CẢNH BÁO / SỢ HÃI: nêu rủi ro, hiểm họa, hậu quả để tạo chú ý cấp bách; kèm giải pháp/cách phòng tránh, tuyệt đối không hù dọa sai sự thật.",
  },
  {
    id: "touching",
    name: "Cảm động / Nhân văn",
    emoji: "🥹",
    description: "Chạm lòng trắc ẩn, tình cảm gia đình.",
    group: "emotion",
    promptFragment:
      "Triển khai kiểu CẢM ĐỘNG / NHÂN VĂN: chạm tới lòng trắc ẩn, tình cảm gia đình, sự biết ơn; dùng chi tiết nhỏ giàu cảm xúc để lay động người đọc.",
  },
  {
    id: "humorous",
    name: "Hài hước / Châm biếm",
    emoji: "😂",
    description: "Tiếng cười, phóng đại để giảm căng thẳng.",
    group: "emotion",
    promptFragment:
      "Kể theo hướng hài hước / châm biếm: dùng tiếng cười, phóng đại và tình huống duyên dáng để giảm căng thẳng và tăng chia sẻ, nhưng không lố.",
  },
  {
    id: "spiritual",
    name: "Tâm linh / Nhân quả",
    emoji: "🔮",
    description: "Niềm tin, chiêm tinh, luật nhân quả.",
    group: "emotion",
    promptFragment:
      "Triển khai kiểu TÂM LINH / NHÂN QUẢ: khai thác niềm tin, chiêm tinh, luật nhân quả một cách nhẹ nhàng, tích cực; không mê tín cực đoan.",
  },

  /* -------------------- Trend & Thời gian thực -------------------- */
  {
    id: "hot-drama",
    name: "Chủ đề HOT / Drama",
    emoji: "🌶️",
    description: "Bám sự kiện đình đám đang được quan tâm.",
    group: "trend",
    promptFragment:
      "Triển khai kiểu CHỦ ĐỀ HOT / DRAMA: bám sát sự kiện đình đám đang được xã hội quan tâm, đưa góc nhìn riêng — tránh bịa đặt hoặc bôi nhọ.",
  },
  {
    id: "realtime",
    name: "Realtime – Tin nóng",
    emoji: "⚡",
    description: "Cập nhật ngay sự kiện vừa xảy ra.",
    group: "trend",
    promptFragment:
      "Triển khai kiểu REALTIME (TIN NÓNG THEO GIỜ): cập nhật ngay sự kiện vừa xảy ra với nhịp nhanh, ngắn gọn, đúng trọng tâm.",
  },
  {
    id: "trend",
    name: "Bắt trend",
    emoji: "🎵",
    description: "Tận dụng âm thanh/định dạng đang thịnh hành.",
    group: "trend",
    promptFragment:
      "Triển khai kiểu BẮT TREND: tận dụng định dạng / âm thanh / thử thách đang thịnh hành, gắn thông điệp của bạn vào trend một cách tự nhiên.",
  },
  {
    id: "big-event",
    name: "Sự kiện lớn trong năm",
    emoji: "🎉",
    description: "Gắn nội dung với lễ Tết, ngày hội mua sắm.",
    group: "trend",
    promptFragment:
      "Triển khai kiểu SỰ KIỆN LỚN TRONG NĂM: gắn nội dung với dịp lễ Tết, ngày hội mua sắm lớn; khai thác cảm xúc và nhu cầu mùa vụ.",
  },

  /* -------------------- Khám phá & Độc lạ -------------------- */
  {
    id: "dramatic",
    name: "Kịch tính",
    emoji: "🎬",
    description: "Tạo cao trào, mâu thuẫn và bất ngờ.",
    group: "discover",
    promptFragment:
      "Kể theo hướng kịch tính: xây dựng căng thẳng, mâu thuẫn và cao trào, tạo nhịp điệu dồn dập và những khoảnh khắc bất ngờ.",
  },
  {
    id: "kol",
    name: "Người nổi tiếng / KOL",
    emoji: "🌟",
    description: "Mượn hình ảnh, phát ngôn người ảnh hưởng.",
    group: "discover",
    promptFragment:
      "Triển khai kiểu NGƯỜI NỔI TIẾNG / KOL: mượn hình ảnh, phát ngôn hoặc câu chuyện của người có sức ảnh hưởng để dẫn dắt thông điệp; trích dẫn hợp lý, không mạo danh.",
  },
  {
    id: "journey",
    name: "Hành trình",
    emoji: "🚀",
    description: "Câu chuyện lột xác từ số 0 đến thành công.",
    group: "discover",
    promptFragment:
      "Triển khai kiểu HÀNH TRÌNH (JOURNEY): kể câu chuyện lột xác từ con số 0 đến thành công, có cao trào và bước ngoặt truyền cảm hứng.",
  },
  {
    id: "weird",
    name: "Độc & lạ / Kỳ quặc",
    emoji: "🤯",
    description: "Hiện tượng hiếm thấy, dị biệt, bất ngờ.",
    group: "discover",
    promptFragment:
      "Triển khai kiểu ĐỘC & LẠ / KỲ QUẶC: khai thác hiện tượng hiếm thấy, dị biệt, bất ngờ ngoài đời thực để tạo tò mò mạnh.",
  },
  {
    id: "secret",
    name: "Bóc trần / Sự thật ngầm",
    emoji: "🕵️",
    description: "Tiết lộ góc khuất ít ai biết.",
    group: "discover",
    promptFragment:
      "Triển khai kiểu BÓC TRẦN / SỰ THẬT NGẦM: tiết lộ góc khuất, bí mật ít ai biết đằng sau một ngành nghề/nhân vật, tạo cảm giác 'người trong cuộc'.",
  },
  {
    id: "quiz",
    name: "Hỏi đáp / Thách thức",
    emoji: "❓",
    description: "Câu đố, bài toán kích thích tương tác.",
    group: "discover",
    promptFragment:
      "Triển khai kiểu HỎI ĐÁP / THÁCH THỨC TƯ DUY: đặt câu hỏi đố vui, bài toán hoặc tình huống kích thích người xem bình luận trả lời và tương tác.",
  },
];

export const getConcept = (id: string): Concept | undefined =>
  CONCEPTS.find((c) => c.id === id);

/** Concepts nhóm theo CONCEPT_GROUPS, giữ đúng thứ tự nhóm. */
export const conceptsByGroup = () =>
  CONCEPT_GROUPS.map((g) => ({
    ...g,
    items: CONCEPTS.filter((c) => c.group === g.id),
  }));
