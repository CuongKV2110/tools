import { getPersona } from "./personas";
import { getConcept } from "./concepts";
import { getTopic } from "./topics";
import { LENGTH_HINT, TONE_HINT } from "./ai";
import type {
  GenerateRequest,
  MaterialRequest,
  VideoScriptRequest,
  AdamScriptRequest,
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
 * constraints are fixed here; only the portrait + script summary come in.
 */
export function buildScriptSystemPrompt(): string {
  return [
    "Bạn vừa là chuyên gia nghiên cứu tâm lý khách hàng, vừa là chuyên gia xây dựng thương hiệu cá nhân và viết kịch bản video ngắn (TikTok/Reels/Shorts).",
    "Văn phong: thật đời thường, dùng từ đơn giản dễ hiểu, cảm xúc cao — viết bằng GIỌNG của một người thực sự làm trong ngành mà người dùng nêu.",
    "Bám sát insight thật trong đầu khách hàng, không lý thuyết chung chung, không văn mẫu.",
    "Trả về Markdown đẹp (heading ##, ###; **in đậm**). Viết tiếng Việt.",
  ].join("\n\n");
}

/** Header shared by both steps: target portrait + desired direction. */
function scriptContext(req: VideoScriptRequest): string[] {
  return [
    "CHÂN DUNG KHÁCH HÀNG MỤC TIÊU:",
    req.customerPortrait.trim(),
    "",
    `TÓM TẮT / ĐỊNH HƯỚNG KỊCH BẢN NGƯỜI DÙNG MUỐN TẠO: ${req.summary?.trim() || "(không nêu cụ thể — hãy tự chọn góc khai thác mạnh nhất phù hợp với chân dung khách hàng)"}.`,
    "",
  ];
}

/** BƯỚC 1 — chỉ phân tích nỗi đau + mong muốn (ngắn gọn). */
export function buildAnalysisPrompt(req: VideoScriptRequest): string {
  return [
    ...scriptContext(req),
    "Hãy phân tích 2 PHẦN sau, viết SÚC TÍCH:",
    "",
    "## PHẦN 1 — 3–5 nỗi đau lớn nhất",
    "Liệt kê 3–5 nỗi đau lớn nhất của khách hàng. Với MỖI nỗi đau, viết NGẮN GỌN mỗi lớp 1 câu:",
    "- **Tình huống thực tế**",
    "- **Cảm xúc bên trong**",
    "- **Suy nghĩ thầm kín**",
    "- **Điều họ từng thử nhưng thất bại**",
    "- **Điều khiến họ áp lực nhất**",
    "",
    "## PHẦN 2 — 3–5 mong muốn thầm kín",
    "Nêu 3–5 mong muốn thầm kín nhất mà khách hàng khao khát nhưng thường không dám nói ra. Với MỖI mong muốn, viết NGẮN GỌN:",
    "- **Mong muốn thầm kín** (viết như khách hàng tự nói trong đầu)",
    "- **Cảm xúc phía sau** (họ thật sự đang thiếu điều gì?)",
    "- **Góc content có thể khai thác** (tự ti / muốn được công nhận / muốn thay đổi…)",
    "- **Hook/video mở đầu** (viết kiểu viral TikTok/Facebook)",
    "",
    "CHỈ trả về Phần 1 & Phần 2, KHÔNG viết kịch bản ở bước này.",
  ].join("\n");
}

/** BƯỚC 2 — viết 3 kịch bản HILLA, dựa trên phần phân tích đã có. */
export function buildScriptsPrompt(req: VideoScriptRequest): string {
  return [
    ...scriptContext(req),
    req.analysis?.trim()
      ? "PHÂN TÍCH NỖI ĐAU & MONG MUỐN (đã có từ bước trước — hãy dựa vào đây):\n" +
        req.analysis.trim()
      : "",
    "",
    "## 3 kịch bản video HILLA chất lượng nhất",
    "BẮT BUỘC viết ĐỦ CHÍNH XÁC 3 kịch bản hoàn chỉnh, đánh số rõ bằng heading: `### Kịch bản 1`, `### Kịch bản 2`, `### Kịch bản 3`. TUYỆT ĐỐI không dừng lại khi chưa viết xong cả 3.",
    "Chọn 3 insight MẠNH NHẤT từ phần phân tích, viết theo công thức HILLA:",
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
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * "Kịch bản Adam" — từ 1 câu hook người dùng đang phân vân + mô tả nội dung +
 * các từ cảm xúc → đề xuất 5 hook ngắn (3 giây đầu) và 5 kịch bản video khác
 * nhau, canh voice cho video dài 35–50 giây. Mọi ràng buộc cố định nằm ở đây.
 */
/**
 * Mẫu kịch bản chuẩn phong cách "Adam" (do người dùng cung cấp) — dùng làm
 * THAM CHIẾU VỀ GIỌNG & MẠCH CẢM XÚC, tuyệt đối không chép lại nội dung.
 */
const ADAM_STYLE_EXAMPLE = `Bầu có ăn được mì cay không mọi người? Hôm nay vợ em lên cơn thèm cái gì cay cay, mà cụ thể là mì cay mới chết chứ.
Ôi mẹ ơi, đây là cái món đứng đầu danh sách đen mà em cấm vợ ăn mấy tháng nay rồi. Nhưng vợ bảo thèm quá không chịu nổi, vật vã lắm rồi...
Nói thật với các bác, lòng em lúc này còn cay và lo hơn cả cái bát mì cay cấp độ 1 của vợ nữa. U là trời!
Mà tức cái là vợ em lại cực kỳ thích húp nước! Trong khi cái nước mì đấy toàn muối với gia vị mặn. Haizz!
Em mới nhắc nhẹ một câu thì vợ em quay sang bảo: "Anh về lên mạng mà hỏi mấy chị em bầu xem người ta có ăn không mà anh cấm em. Gia trưởng nó vừa vừa thôi!"
Đấy, mọi người nghe xem có tức không! Thật ra em cũng chỉ sợ ảnh hưởng đến bụng dạ của vợ với em bé thôi.
Các mẹ bầu khác thì sao? Có ai nghén mì cay giống vợ em không?`;

/**
 * Hashtag cố định của kênh (tầng thương hiệu + ngách + cộng đồng). AI sẽ thêm
 * 1–3 hashtag chủ đề bám theo từng video. Đổi ở đây nếu kênh đổi tên/ngách.
 */
const ADAM_BRAND_HASHTAGS = "#cuongtaplamchong #chongchamvobau #mebau";

export function buildAdamSystemPrompt(): string {
  return [
    "Bạn là chuyên gia viết hook và kịch bản video ngắn (TikTok/Reels/Shorts) theo phong cách 'Adam', chuyên về chủ đề MẸ BẦU – MẸ BỈM – MANG THAI – THAI KỲ.",
    "Văn phong: KỂ CHUYỆN ngôi thứ nhất như đang nhìn thẳng camera tâm sự với 'mọi người/các mẹ/các bác'. Câu ngắn, từ đời thường, cảm xúc thật, nhiều thán từ — TUYỆT ĐỐI không văn mẫu, không hàn lâm, không liệt kê khô khan.",
    "Mọi kịch bản phải xoay quanh đời sống thai kỳ/mẹ bỉm (ăn uống, nghén, kiêng cữ, sức khỏe mẹ & bé, tâm lý vợ chồng khi mang thai…) và CHÍNH XÁC về mặt kiến thức — khi nhắc thông tin sức khỏe thì nhẹ nhàng, không phán như bác sĩ, luôn khuyến khích hỏi ý kiến chuyên gia khi cần.",
    "DƯỚI ĐÂY là 1 mẫu kịch bản chuẩn phong cách cần bắt chước về GIỌNG & MẠCH CẢM XÚC (KHÔNG chép nội dung, chỉ học cách kể):",
    ADAM_STYLE_EXAMPLE,
    "Trả về Markdown đẹp (heading ##, ###; **in đậm**). Viết bằng tiếng Việt.",
  ].join("\n\n");
}

export function buildAdamPrompt(req: AdamScriptRequest): string {
  const emotions = req.emotionWords?.trim();
  return [
    req.desiredHook?.trim()
      ? [
          "CÂU HOOK MONG MUỐN CỦA NGƯỜI DÙNG (đây là CHỦ ĐỀ / GÓC HOOK GỐC — CỰC KỲ QUAN TRỌNG):",
          req.desiredHook.trim(),
          "→ Cả 5 câu hook BẮT BUỘC phải CÙNG CHỦ ĐỀ, CÙNG GÓC KHAI THÁC với câu trên; chỉ viết lại cho sắc hơn, hấp dẫn hơn. TUYỆT ĐỐI không đi lạc sang chủ đề mẹ bầu khác. Nếu câu gốc là một ý tổng quát (vd 'Tổng kết tam cá nguyệt thứ 1') thì mọi hook phải xoay quanh đúng ý đó (nhìn lại/tổng kết/điều cần nhớ của giai đoạn đó).",
        ].join("\n")
      : "CÂU HOOK MONG MUỐN: (người dùng chưa nhập — hãy tự nghĩ hook mạnh nhất bám theo phần mô tả nội dung bên dưới).",
    "",
    "MÔ TẢ SƠ BỘ NỘI DUNG (diễn biến, hướng kịch bản, cái kết mong muốn):",
    req.summary?.trim() || "(không nêu cụ thể — tự chọn góc khai thác mạnh nhất hợp lý)",
    "",
    emotions
      ? `CÁC TỪ KHÓA CẢM XÚC BẮT BUỘC CHÈN TỰ NHIÊN VÀO KỊCH BẢN: ${emotions}. Rải đều, đúng lúc, đúng cảm xúc — không gượng ép, không nhồi nhét.`
      : "Người dùng không nhập từ cảm xúc riêng — hãy tự thêm các thán từ cảm xúc đời thường (vd: U là trời, Haizz, Woaa, Ây za…) ở những khoảnh khắc hợp lý.",
    "",
    "CHỦ ĐỀ KÊNH (bắt buộc bám sát): mẹ bầu, mẹ bỉm, mang thai, các vấn đề trong thai kỳ. Mọi hook và kịch bản phải nằm trong thế giới này.",
    "",
    "Hãy trả về ĐÚNG 2 PHẦN theo thứ tự, dùng heading Markdown:",
    "",
    "## 5 câu hook đề xuất",
    "Viết ĐÚNG 5 câu hook, để nói trong 3 GIÂY ĐẦU của video.",
    "- ƯU TIÊN SỐ 1: nếu người dùng có nhập 'Câu hook mong muốn' ở trên, cả 5 hook phải BÁM CHẶT đúng chủ đề/góc đó (chỉ là 5 cách diễn đạt khác nhau cho cùng ý). Chỉ khi KHÔNG có câu hook mong muốn mới tự chọn góc từ phần mô tả nội dung.",
    "- Mỗi hook CỰC NGẮN: khoảng 8–12 từ, đọc hết dưới 3 giây.",
    "- QUAN TRỌNG: mỗi hook phải NÊU NGAY 1 VẤN ĐỀ / CÂU HỎI mà rất nhiều mẹ bầu quan tâm (kiểu 'Bầu có ăn được … không mọi người?', 'Bầu mấy tháng thì…?', 'Nghén … có sao không?') để ai đang mang thai lướt tới là phải dừng lại.",
    "- BẮT BUỘC: mỗi hook phải CHỨA ít nhất 1 trong các TỪ KHÓA TẠO ĐIỂM NHẤN sau (ưu tiên đặt ở đầu câu, dùng xen kẽ cho đa dạng): \"Đừng\", \"Trước khi\", \"Nếu\", \"Vẫn\", \"Hóa ra\".",
    "- 5 hook phải KHÁC KIỂU nhau (câu hỏi lo lắng, tình huống dở khóc dở cười, cảnh báo sai lầm…). Đánh số 1–5, mỗi hook một dòng, KHÔNG giải thích.",
    "",
    "PHẦN 2 — 5 KỊCH BẢN VIDEO. KHÔNG viết heading tổng bao ngoài; đi thẳng vào từng kịch bản.",
    "Viết ĐỦ CHÍNH XÁC 5 kịch bản KHÁC NHAU, mỗi kịch bản là 1 heading cấp 2 RIÊNG: `## Kịch bản 1 — <góc khai thác>`, `## Kịch bản 2 — <góc khai thác>`, … đến `## Kịch bản 5 — <góc khai thác>`. KHÔNG dùng heading cấp 3; KHÔNG dừng khi chưa viết xong cả 5.",
    "QUAN TRỌNG NHẤT — mỗi kịch bản phải NHẤN MẠNH RÕ RỆT vào ĐÚNG 1 ĐÒN TÂM LÝ chủ đạo, phân bổ như sau (ghi luôn đòn này vào sau dấu '—' ở heading):",
    "- Kịch bản 1 → **NỖI ĐAU**: khoét thật sâu nỗi đau/nỗi sợ/sự bất lực của người xem, gọi tên đúng cảm giác họ đang chịu đựng để họ thấy 'đúng là mình'. Đây là kịch bản QUAN TRỌNG NHẤT, làm mạnh tay nhất — vì video chạm nỗi đau dễ viral, share & lưu cao.",
    "- Kịch bản 2 → **SỰ ĐỒNG CẢM**: 'mình hiểu mà', kể như người từng trải, vỗ về, khiến người xem thấy được thấu hiểu và không cô đơn.",
    "- Kịch bản 3 → **SỰ TÒ MÒ**: tạo khoảng trống thông tin, hé lộ nửa chừng, giữ bí mật buộc phải xem tới cuối mới có đáp án.",
    "- Kịch bản 4 → **SỰ KHÓ HIỂU CẦN GIẢI THÍCH**: nêu một điều gây hoang mang/hiểu lầm/trái ngược thường thấy, rồi giải thích cho vỡ lẽ ('à, hóa ra là vậy').",
    "- Kịch bản 5 → **SỰ MONG ƯỚC**: khơi khao khát, vẽ ra viễn cảnh/kết quả tốt đẹp mà người xem thầm mong, truyền hy vọng và động lực.",
    "Dù mang đòn chủ đạo riêng, MỌI kịch bản vẫn nên chạm nhẹ vào nỗi đau ở phần mở/diễn biến rồi mới đẩy sang đòn chính của nó.",
    "Mỗi kịch bản bám theo nội dung mô tả ở trên, KẾT HỢP các từ cảm xúc đã nêu, và BẮT BUỘC đi theo đúng MẠCH 4 BƯỚC sau (giống mẫu phong cách):",
    "1. **Câu mở đầu (Hook)**: nêu thẳng 1 vấn đề/câu hỏi nhiều mẹ bầu quan tâm — có thể chọn/biến tấu từ 5 hook ở trên. BẮT BUỘC chứa ít nhất 1 trong các từ tạo điểm nhấn: \"Đừng\", \"Trước khi\", \"Nếu\", \"Vẫn\", \"Hóa ra\".",
    "2. **Diễn biến**: kể 1 tình huống đời thường, cụ thể, có nhân vật (vợ/chồng/mẹ bỉm) khiến người xem thấy chính mình trong đó; cảm xúc tăng dần.",
    "3. **Giải pháp + Twist**: đưa ra thông tin/giải pháp đúng đắn một cách tự nhiên, kèm 1 TWIST bất ngờ (một câu phản pháo, một sự thật ít ai ngờ, một cú lật góc nhìn) để tạo bất ngờ và tranh luận.",
    "4. **Kết**: chốt lại cảm xúc/thông điệp ấm áp, rồi kết bằng 1 CÂU HỎI TƯƠNG TÁC mời các mẹ khác bình luận (kéo comment & share).",
    "",
    "Yêu cầu BẮT BUỘC thêm cho mỗi kịch bản:",
    "- Viết ở ngôi thứ nhất, kể chuyện tâm sự với 'mọi người / các mẹ / các bác', đúng giọng mẫu phong cách.",
    "- THỜI LƯỢNG VOICE 35–50 GIÂY khi đọc thành tiếng ở tốc độ tự nhiên → viết khoảng 90–140 từ cho mỗi kịch bản. Bám sát khoảng từ này để không quá ngắn/quá dài.",
    "- Giọng đời thường, Face-to-Face, dễ quay bằng điện thoại, không cần cảnh phụ.",
    "- CHIA TỪNG CÂU XUỐNG DÒNG (mỗi câu một dòng riêng) để đọc trước camera cho dễ.",
    "- Rải các từ cảm xúc đúng lúc để tăng cảm xúc; cài câu giữ chân ở đoạn diễn biến/twist.",
    "- Thông tin sức khỏe thai kỳ phải CHÍNH XÁC và nhẹ nhàng, không phán chắc như bác sĩ.",
    "- Heading mỗi kịch bản đã nêu góc khai thác; sau nội dung kịch bản ghi 1 dòng: **⏱ Ước lượng voice: ~XX giây** (nằm trong 35–50s).",
    "- SAU dòng voice, THÊM ĐỦ 2 DÒNG sau cho MỖI kịch bản (để đăng TikTok & Facebook Reels):",
    "  • **📝 Caption:** viết 1–2 câu. CÂU ĐẦU là hook kịch tính / mở một 'vòng lặp' — hé lộ tình huống nhưng GIẤU kết quả để người xem phải xem hết; nhồi từ khóa tự nhiên (ốm nghén, bà bầu 3 tháng đầu, mang thai…); có 1 CTA nhẹ (lưu lại / tag chồng / comment); KẾT bằng 1 câu hỏi mời bình luận; thêm vài emoji hợp cảnh.",
    `  • **#️⃣ Hashtag:** 4–6 hashtag theo 3 TẦNG, cách nhau bằng dấu cách. LUÔN mở đầu bằng ${ADAM_BRAND_HASHTAGS} (thương hiệu + ngách + cộng đồng), rồi thêm 1–3 hashtag CHỦ ĐỀ bám đúng nội dung video (ví dụ: #omnghen #daudaukhimangthai #thaiky #3thangdau #baubi #nghennon). TUYỆT ĐỐI KHÔNG dùng #xuhuong, #foryou, #fyp hay các mega-tag bão hoà.`,
  ]
    .filter(Boolean)
    .join("\n");
}
