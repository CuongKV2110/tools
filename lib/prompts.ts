import { getPersona } from "./personas";
import { getConcept } from "./concepts";
import { getTopic } from "./topics";
import { LENGTH_HINT, TONE_HINT } from "./ai";
import type {
  GenerateRequest,
  MaterialRequest,
  VideoScriptRequest,
} from "@/types";

/** Build the system prompt for the AI Content Generator. */
export function buildContentSystemPrompt(req: GenerateRequest): string {
  const topic = getTopic(req.topicId);
  const persona = getPersona(req.personaId);
  const concept = getConcept(req.conceptId);

  // A user-provided formula takes priority over the preset concept.
  const storyInstruction = req.formula?.trim()
    ? `Hãy tuân theo CÔNG THỨC KỂ CHUYỆN do người dùng cung cấp dưới đây (áp dụng đúng cấu trúc, phong cách và yêu cầu trong đó):\n${req.formula.trim()}`
    : (concept?.promptFragment ?? "");

  return [
    topic?.promptFragment ??
      persona?.promptFragment ??
      "Bạn là một người viết nội dung chuyên nghiệp.",
    storyInstruction,
    `Giọng văn: ${TONE_HINT[req.tone] ?? req.tone}.`,
    `Độ dài phần thân bài: ${LENGTH_HINT[req.length] ?? req.length}. Hãy bám sát số lượng từ này.`,
    "Viết bằng tiếng Việt trừ khi người dùng yêu cầu ngôn ngữ khác.",
    "TRẢ VỀ ĐÚNG 3 KHỐI theo thứ tự, mỗi khối bắt đầu bằng đúng nhãn nằm riêng một dòng (không thêm chữ nào khác quanh nhãn):",
    "[HOOKS]",
    [
      "Viết ĐÚNG 5 câu hook mở đầu để nói trong 3 GIÂY ĐẦU của video ngắn (TikTok/Reels/Shorts).",
      "NGUYÊN TẮC BẮT BUỘC cho mỗi hook:",
      "- CỰC NGẮN: tối đa ~12 từ, đọc hết dưới 3 giây. Không giải thích, không rào đón, vào thẳng.",
      "- Câu đầu tiên phải khiến người xem KHỰNG LẠI ngay lập tức (pattern interrupt) — đánh trúng 1 tâm lý: tò mò tột độ, sợ bỏ lỡ (FOMO), chạm nỗi đau/nỗi sợ, khơi khao khát, hoặc gây tranh cãi.",
      "- Tạo 'khoảng trống thông tin' (curiosity gap): hé lộ đủ để tò mò nhưng GIỮ LẠI đáp án, buộc phải xem tiếp.",
      "- Dùng ngôn ngữ đời thường, nói như đang nhìn thẳng camera; ưu tiên 'bạn/mày', con số cụ thể, động từ mạnh. Tránh từ sáo rỗng, hàn lâm.",
      "- Khả thi viral cao: dễ đồng cảm hoặc dễ gây phản ứng (đồng tình/phản đối) để tăng comment & share.",
      "5 hook phải KHÁC KIỂU nhau, mỗi kiểu 1 câu: (1) tuyên bố gây sốc/ngược đời, (2) câu hỏi chạm thẳng nỗi đau, (3) con số/kết quả gây tò mò, (4) cảnh báo sai lầm ('Đừng… nếu chưa biết điều này'), (5) mở bằng câu chuyện/tình huống dở dang.",
      "Đánh số 1–5, mỗi hook một dòng, KHÔNG thêm lời giải thích.",
    ].join("\n"),
    "[THANBAI]",
    "Nội dung chính hoàn chỉnh ở định dạng Markdown (đoạn văn rõ ràng, danh sách, **in đậm** khi hợp lý). KHÔNG lặp lại các hook.",
    "[KET]",
    "Một đoạn KẾT thật chất lượng: chốt lại cảm xúc/thông điệp mạnh, để lại dư âm, và có LỜI KÊU GỌI HÀNH ĐỘNG (CTA) rõ ràng, tự nhiên.",
    "Không thêm bất kỳ lời dẫn nào ngoài 3 khối trên.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

/**
 * "Chất liệu bản thân": build the analysis prompt (audience targeting +
 * deep customer portrait). The heavy, fixed instruction lives here; only the
 * product name / description / (optional) target audience come from the user.
 */
export function buildMaterialSystemPrompt(): string {
  return [
    "Bạn vừa là chuyên gia chiến lược xây dựng thương hiệu cá nhân bằng video ngắn, vừa là chuyên gia tâm lý học hành vi & nghiên cứu thị trường chuyên sâu.",
    "Văn phong: đời thường, sâu sắc, cụ thể — TUYỆT ĐỐI không dùng văn mẫu chung chung.",
    "Trả về kết quả ở định dạng Markdown đẹp: dùng heading (##, ###), danh sách, **in đậm**, và BẢNG Markdown ở những chỗ được yêu cầu.",
    "Viết bằng tiếng Việt.",
  ].join("\n\n");
}

export function buildMaterialPrompt(req: MaterialRequest): string {
  const audienceLine = req.targetAudience?.trim()
    ? `Nhóm người xem mục tiêu đã chọn: ${req.targetAudience.trim()}`
    : "Người dùng CHƯA chọn nhóm mục tiêu — hãy tự xác định ở PHẦN 1, rồi phân tích đúng nhóm bạn đề xuất ở PHẦN 2.";

  return [
    "SẢN PHẨM / THƯƠNG HIỆU CÁ NHÂN:",
    `- Tên: ${req.productName.trim()}`,
    `- Mô tả (chất liệu): ${req.productDescription.trim()}`,
    `- ${audienceLine}`,
    "",
    "Hãy thực hiện đầy đủ 2 PHẦN dưới đây:",
    "",
    "## PHẦN 1 — Xác định tệp người xem mục tiêu",
    "1. Liệt kê 5 tệp người xem tiềm năng nhất có thể nhận giá trị từ kênh.",
    "2. Lập BẢNG chấm điểm cho 5 nhóm với các cột: | Tệp người xem | Độ cấp thiết (1-10) | Khả năng ứng dụng (1-10) | Tổng | Ghi chú |.",
    "3. ĐỀ XUẤT 01 nhóm lý tưởng nhất để tập trung phục vụ, kèm lý do thuyết phục.",
    "",
    "## PHẦN 2 — Phân tích chuyên sâu nhóm được đề xuất",
    "Phân tích nhóm này theo 11 hạng mục:",
    "1. **Nhân khẩu học & hành vi**: tuổi, giới tính, vị trí, công việc, tình trạng quan hệ, tài chính thực tế, hành vi tiêu dùng online.",
    "2. **Quan sát thực tế (Customer Observation)**: một sự thật trần trụi về đời sống hằng ngày / cách họ đang loay hoay.",
    "3. **Mục tiêu giá trị**: điều họ coi trọng nhất (tốc độ / an toàn / uy tín / tiện lợi…).",
    "4. **Vai trò & trở ngại mua hàng**: ai ra quyết định, ai ảnh hưởng, trở ngại lớn nhất khi xuống tiền.",
    "5. **Độ khẩn cấp & đối tượng mua ngay**: ai PHẢI hành động ngay và vì sao không thể trì hoãn.",
    "6. **Lý do thực sự (The Real Why)**: động cơ sâu xa bên trong, không phải lý do bề mặt.",
    "7. **Insight về nỗi đau** — phân tích đủ 9 điểm: sự thiếu thốn, sự an toàn (lo sợ), điểm yếu (tự ti), sự phiền toái, sự an ủi, đồng minh (cô đơn), bù đắp trách nhiệm (có lỗi với ai), bị coi thường, khao khát khen ngợi.",
    "8. **Insight về lòng tham**: họ muốn đạt kết quả gì nhanh hơn / dễ hơn / nhiều hơn người khác.",
    "9. **Insight cảm xúc chủ đạo**: cảm xúc nào chi phối họ (tức giận / bất lực / hy vọng…).",
    "10. **Rào cản khó khăn**: khó khăn thực tế với giải pháp hiện tại/cũ.",
    "11. **Bản đồ hành trình khách hàng (Customer Journey Map)**: lập BẢNG 5 cột — | Giai đoạn | Tình huống cụ thể | Hành vi | Điểm chạm (Touchpoint) | Cơ hội cho kênh của tôi | — với 5 giai đoạn: Phát sinh nhu cầu, Cân nhắc, Quyết định, Sử dụng, Trung thành.",
  ].join("\n");
}

/**
 * "Kịch bản video" — from a customer portrait: analyse 5 pains + 3 hidden
 * desires, then produce 3 best HILLA scripts. The HILLA formula and all script
 * constraints are fixed here; only the portrait + industry voice come in.
 */
export function buildScriptSystemPrompt(): string {
  return [
    "Bạn vừa là chuyên gia nghiên cứu tâm lý khách hàng, vừa là chuyên gia xây dựng thương hiệu cá nhân và viết kịch bản video ngắn (TikTok/Reels/Shorts).",
    "Văn phong: thật đời thường, dùng từ đơn giản dễ hiểu, cảm xúc cao — viết bằng GIỌNG của một người thực sự làm trong ngành mà người dùng nêu.",
    "Bám sát insight thật trong đầu khách hàng, không lý thuyết chung chung, không văn mẫu.",
    "Trả về Markdown đẹp (heading ##, ###; **in đậm**). Viết tiếng Việt.",
  ].join("\n\n");
}

export function buildScriptPrompt(req: VideoScriptRequest): string {
  return [
    "CHÂN DUNG KHÁCH HÀNG MỤC TIÊU:",
    req.customerPortrait.trim(),
    "",
    `GIỌNG NGƯỜI LÀM KÊNH (viết như người trong ngành này): ${req.industry.trim() || "người có kinh nghiệm thực tế trong lĩnh vực liên quan"}.`,
    "",
    "Hãy thực hiện đầy đủ 3 PHẦN sau:",
    "",
    "## PHẦN 1 — 5 nỗi đau lớn nhất",
    "Liệt kê 5 nỗi đau lớn nhất của khách hàng. Với MỖI nỗi đau, phân tích rõ 5 lớp:",
    "- **Tình huống thực tế**",
    "- **Cảm xúc bên trong**",
    "- **Suy nghĩ thầm kín**",
    "- **Điều họ từng thử nhưng thất bại**",
    "- **Điều khiến họ áp lực nhất**",
    "",
    "## PHẦN 2 — 3 mong muốn thầm kín",
    "Nêu 3 mong muốn thầm kín nhất mà khách hàng khao khát nhưng thường không dám nói ra. Với MỖI mong muốn, trình bày:",
    "- **Mong muốn thầm kín** (viết như khách hàng tự nói trong đầu)",
    "- **Cảm xúc phía sau** (họ thật sự đang thiếu điều gì?)",
    "- **Góc content có thể khai thác** (tự ti / muốn được công nhận / muốn thay đổi…)",
    "- **Hook/video mở đầu** (viết kiểu viral TikTok/Facebook)",
    "",
    "## PHẦN 3 — 3 kịch bản video HILLA chất lượng nhất",
    "Chọn 3 insight MẠNH NHẤT từ Phần 1 & 2, viết thành 3 kịch bản video hoàn chỉnh theo công thức HILLA:",
    "- **H = Hook** — dưới 3 giây, chạm thẳng nỗi đau hoặc mong muốn, có yếu tố tò mò.",
    "- **I = Interest** — nuôi sự tò mò, khiến người xem muốn nghe tiếp.",
    "- **L = Logic** — mạch lý lẽ/giải thích hợp lý.",
    "- **L = Lesson** — bài học / điều rút ra.",
    "- **A = Action** — kêu gọi hành động cuối video.",
    "",
    "Yêu cầu BẮT BUỘC cho mỗi kịch bản:",
    "- Cài các CÂU GIỮ CHÂN người xem giữa kịch bản, ví dụ: “Nhưng đó chưa phải điều quan trọng nhất.”, “Và đây mới là sai lầm lớn nhất.”, “Tôi đã nghĩ như vậy cho đến khi…”.",
    "- Giọng đời thường, dễ nói trước camera, dễ quay bằng điện thoại, kiểu Face-to-Face, KHÔNG cần cảnh quay phụ.",
    "- Thời lượng 60–90 giây.",
    "- CHIA TỪNG CÂU XUỐNG DÒNG (mỗi câu một dòng riêng) để đọc trước camera cho dễ.",
    "- Ghi rõ nhãn từng khối: H (Hook) / I / L / L / A.",
    "- Mỗi kịch bản có tiêu đề ngắn nêu insight nó khai thác.",
  ].join("\n");
}
