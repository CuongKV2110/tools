/** Nội dung chi tiết cho thư viện "Concept viral". */
export interface ConceptDetail {
  /** Vì sao concept này dễ viral (cơ chế tâm lý). */
  whyViral: string;
  /** Khi nào nên dùng. */
  whenToUse: string;
  /** Ví dụ tiêu đề / hook cụ thể. */
  examples: string[];
  /** Câu chuyện / kịch bản demo ngắn minh hoạ. */
  demo: string;
}

export const CONCEPT_DETAILS: Record<string, ConceptDetail> = {
  /* -------------------- Giá trị & Thực tiễn -------------------- */
  compare: {
    whyViral:
      "Não bộ bị hút vào sự đối lập. Đặt hai thứ cạnh nhau tạo 'khoảng hở nhận thức' khiến người xem tò mò muốn biết bên nào thắng.",
    whenToUse:
      "Khi muốn làm nổi bật ưu điểm của sản phẩm/quan điểm bằng cách so với cái quen thuộc.",
    examples: [
      "Tôi bỏ điện thoại xịn dùng máy 3 triệu 30 ngày — và cái kết bất ngờ",
      "Cơm mẹ nấu vs cơm nhà hàng 5 sao: khác biệt nằm ở thứ không có trong thực đơn",
      "Tiết kiệm kiểu ông bà vs kiểu Gen Z, ai mới đúng?",
    ],
    demo: "Mở đầu đặt 2 hình ảnh đối lập cạnh nhau (cũ – mới, rẻ – đắt). Nêu điểm mạnh mỗi bên. Đến giữa video tung một 'cú lật': cái tưởng thua lại thắng ở khía cạnh người ta không ngờ. Chốt bằng bài học cho người xem.",
  },
  howto: {
    whyViral:
      "Nội dung giải quyết ngay một vấn đề cụ thể → người xem lưu lại và chia sẻ vì thấy 'hữu ích thật'.",
    whenToUse: "Khi khán giả của bạn đang có một vấn đề nhỏ cần cách xử lý nhanh.",
    examples: [
      "3 mẹo rã đông thịt trong 5 phút mà không cần lò vi sóng",
      "Cách gấp áo thun không nhăn chỉ với 2 giây",
      "Làm sạch nồi cháy đen chỉ bằng 1 thứ trong bếp",
    ],
    demo: "Hook nêu thẳng vấn đề ('Nồi cháy đen chà mãi không sạch?'). Đưa 3 bước cực ngắn, mỗi bước một hành động rõ ràng. Kết bằng lời mời lưu lại để dùng khi cần.",
  },
  "last-minute": {
    whyViral:
      "Trì hoãn phần thưởng tạo tò mò kéo dài — người xem ở lại tới cuối để 'lấy được thứ hay nhất'. Tăng mạnh thời lượng xem.",
    whenToUse: "Khi bạn có một 'điểm chốt' cực giá trị và muốn giữ chân người xem.",
    examples: [
      "5 lỗi khiến bạn mãi nghèo — cái số 5 hầu như ai cũng mắc",
      "Đừng bỏ lỡ mẹo cuối cùng, nó thay đổi tất cả",
    ],
    demo: "Ngay hook, hứa hẹn 'điều giá trị nhất ở cuối'. Xuyên suốt cài các câu nhắc 'khoan đã, chưa phải cái hay nhất'. Đến cuối mới bung insight/mẹo mạnh nhất.",
  },
  experience: {
    whyViral:
      "Câu chuyện thật của người trong cuộc tạo lòng tin và cảm xúc mà lý thuyết không có được.",
    whenToUse: "Khi bạn có trải nghiệm/bài học xương máu thật để kể.",
    examples: [
      "Mất 200 triệu đầu tiên vì sai lầm này, giờ tôi kể để bạn tránh",
      "3 năm làm nghề dạy tôi điều không trường lớp nào nói",
    ],
    demo: "Kể lại một tình huống thật bạn từng thất bại. Cảm xúc lúc đó. Điều bạn nhận ra. Rồi biến nó thành 1 bài học người xem áp dụng được.",
  },
  diy: {
    whyViral:
      "Cảm giác 'mình cũng làm được' + nguyên liệu dễ kiếm khiến người xem lưu lại để thử.",
    whenToUse: "Khi có thể hướng dẫn tự làm một thứ hữu ích với đồ dễ tìm.",
    examples: [
      "Tự làm kệ gỗ để bàn từ 1 thùng carton",
      "Món ăn 3 nguyên liệu, 10 phút có ngay bữa tối",
    ],
    demo: "Khoe thành phẩm trước để tạo mong muốn. Liệt kê nguyên liệu dễ kiếm. Quay nhanh từng bước. Kết bằng thành phẩm + mời người xem thử.",
  },
  educational: {
    whyViral:
      "Kiến thức được sắp xếp rõ ràng, dễ nhớ → người xem thấy 'học được gì đó' và lưu lại.",
    whenToUse: "Khi muốn định vị bạn là người hiểu biết trong lĩnh vực.",
    examples: [
      "Hiểu về lãi kép trong 60 giây",
      "3 khái niệm ai cũng nên biết trước tuổi 25",
    ],
    demo: "Nêu một khái niệm. Giải thích bằng ví dụ đời thường. Tóm 3 ý chính. Kết bằng câu khiến người xem muốn tìm hiểu thêm.",
  },
  seo: {
    whyViral:
      "Tối ưu tìm kiếm giúp nội dung sống lâu, tiếp cận đúng người đang chủ động tìm.",
    whenToUse: "Khi viết bài blog/website cần lên top tìm kiếm.",
    examples: [
      "Cách chọn [từ khoá] cho người mới bắt đầu (2025)",
      "[Từ khoá] là gì? Hướng dẫn A-Z dễ hiểu",
    ],
    demo: "Tiêu đề chứa từ khoá chính. Mở đầu trả lời ngay câu hỏi. Chia H2/H3 theo ý tìm kiếm. Kết luận + lời kêu gọi.",
  },

  /* -------------------- Tâm lý & Cảm xúc -------------------- */
  emotional: {
    whyViral:
      "Cảm xúc là chất dẫn chia sẻ. Ký ức và sự đồng cảm khiến người xem thấy 'giống mình' và gửi cho người thân.",
    whenToUse: "Khi câu chuyện có yếu tố gia đình, tuổi thơ, sự trưởng thành.",
    examples: [
      "Bữa cơm cuối cùng mẹ nấu trước khi tôi lên thành phố",
      "Thứ tôi tưởng bỏ đi, hoá ra là cả tuổi thơ",
    ],
    demo: "Mở bằng một chi tiết nhỏ gợi ký ức (mùi cơm, tiếng xe đạp). Kể lại khoảnh khắc. Để cảm xúc lắng. Chốt bằng một câu chạm tim.",
  },
  controversy: {
    whyViral:
      "Quan điểm trái chiều kích hoạt nhu cầu 'phải lên tiếng' → bình luận bùng nổ, đẩy tương tác.",
    whenToUse: "Khi bạn có góc nhìn khác số đông và đủ lý lẽ bảo vệ. Giữ văn minh.",
    examples: [
      "Tiết kiệm để mua nhà ở tuổi 25 là một sai lầm?",
      "Có thể bạn đang dạy con sai mà không biết",
    ],
    demo: "Tung quan điểm ngược dòng ngay hook. Đưa 1-2 lý lẽ chắc. Thừa nhận mặt đúng của phía kia (để không cực đoan). Mời tranh luận ở bình luận.",
  },
  consensus: {
    whyViral:
      "Nói đúng điều nhiều người đang nghĩ tạo cảm giác 'được đại diện' → họ chia sẻ như tuyên ngôn.",
    whenToUse: "Khi có một nỗi bức xúc/khát khao chung của cộng đồng.",
    examples: [
      "Ai cũng thấy nhưng ít người dám nói điều này",
      "Gửi những người đi làm lương ba cọc ba đồng mà vẫn cố gắng",
    ],
    demo: "Gọi tên cảm giác chung ('Bạn có thấy...'). Khẳng định điều họ nghĩ là hợp lý. Cho họ lời an ủi/động lực. Kết bằng câu để họ tag người cùng cảnh.",
  },
  warning: {
    whyViral:
      "Não ưu tiên tín hiệu nguy hiểm. Thông tin rủi ro tạo sự chú ý cấp bách và nhu cầu chia sẻ để bảo vệ người thân.",
    whenToUse: "Khi có rủi ro thật người xem nên biết. Luôn kèm cách phòng tránh.",
    examples: [
      "Thói quen tưởng vô hại này đang âm thầm hại ví bạn",
      "Đừng làm điều này với điện thoại khi sạc qua đêm",
    ],
    demo: "Hook cảnh báo ngắn gọn. Nêu hậu quả cụ thể. Giải thích vì sao. Cho giải pháp/cách tránh. Không phóng đại sai sự thật.",
  },
  touching: {
    whyViral:
      "Sự tử tế và lòng biết ơn lan truyền mạnh vì người ta muốn 'gieo điều tốt'.",
    whenToUse: "Khi có câu chuyện nhân văn, tình thân, sự tử tế.",
    examples: [
      "Người shipper và hành động khiến cả quán lặng đi",
      "Bố không nói yêu con bao giờ, nhưng...",
    ],
    demo: "Dựng một tình huống đời thường. Một hành động tử tế bất ngờ. Khoảnh khắc lay động. Chốt bằng thông điệp về lòng biết ơn.",
  },
  humorous: {
    whyViral:
      "Tiếng cười tạo cảm giác dễ chịu → người xem xem hết, chia sẻ để 'cười cùng bạn bè'.",
    whenToUse: "Khi muốn giảm căng thẳng, thân thiện hoá thương hiệu.",
    examples: [
      "Các kiểu người trong phòng họp — bạn là ai?",
      "Khi vợ nói 'tuỳ anh' — sách sinh tồn cho đàn ông",
    ],
    demo: "Phóng đại một tình huống ai cũng gặp. Thêm cú 'twist' hài. Giữ nhịp nhanh. Chốt bằng câu đùa duyên khiến người xem gửi cho bạn bè.",
  },
  spiritual: {
    whyViral:
      "Niềm tin về nhân quả/vận may chạm vào nhu cầu tìm ý nghĩa và hy vọng.",
    whenToUse: "Khi nội dung hướng thiện, truyền cảm hứng sống tử tế.",
    examples: [
      "3 việc tử tế nhỏ mà người xưa tin sẽ đổi vận",
      "Vì sao càng cho đi lại càng nhận về?",
    ],
    demo: "Nêu một niềm tin dân gian nhẹ nhàng. Kể một ví dụ minh hoạ. Rút ra bài học sống tử tế. Tránh mê tín cực đoan, giữ tích cực.",
  },

  /* -------------------- Trend & Thời gian thực -------------------- */
  "hot-drama": {
    whyViral:
      "Bám sự kiện đang nóng giúp nội dung 'ăn theo' lượng tìm kiếm và quan tâm khổng lồ sẵn có.",
    whenToUse: "Khi có sự kiện đình đám liên quan lĩnh vực của bạn.",
    examples: [
      "Góc nhìn khác về drama đang hot: bài học cho người làm nghề",
      "Ai cũng bàn về [sự kiện], nhưng đây là điều bị bỏ qua",
    ],
    demo: "Nhắc sự kiện đang nóng (không bịa/bôi nhọ). Đưa góc nhìn riêng gắn với chuyên môn của bạn. Rút bài học cho người xem.",
  },
  realtime: {
    whyViral:
      "Tốc độ tạo lợi thế 'người đầu tiên' — thuật toán ưu ái nội dung bắt tin nóng đúng lúc.",
    whenToUse: "Khi vừa có sự kiện/thông tin mới liên quan khán giả.",
    examples: [
      "NÓNG: [sự kiện] vừa xảy ra — tóm tắt 60 giây",
      "Cập nhật mới nhất về [chủ đề] tính đến giờ này",
    ],
    demo: "Vào thẳng tin: cái gì, khi nào, ảnh hưởng ai. Ngắn – nhanh – đúng trọng tâm. Hẹn cập nhật tiếp theo.",
  },
  trend: {
    whyViral:
      "Âm thanh/định dạng trend được thuật toán đẩy mạnh; gắn thông điệp vào là 'đi nhờ' lượt phân phối.",
    whenToUse: "Khi có trend phù hợp và bạn khéo lồng thông điệp.",
    examples: [
      "Bắt trend [âm thanh hot] theo cách của dân [ngành của bạn]",
      "Thử thách [tên trend] phiên bản đời thực",
    ],
    demo: "Dùng đúng âm thanh/format đang hot. Lồng thông điệp/sản phẩm của bạn tự nhiên trong 1-2 giây chốt. Giữ đúng 'chất' của trend.",
  },
  "big-event": {
    whyViral:
      "Dịp lễ khơi cảm xúc và nhu cầu mua sắm cao — nội dung đúng mùa dễ được đón nhận và chia sẻ.",
    whenToUse: "Trước và trong các dịp Tết, 8/3, Black Friday, khai giảng…",
    examples: [
      "Quà Tết cho bố mẹ dưới 500k mà cực ý nghĩa",
      "Checklist chuẩn bị [dịp lễ] để không cuống phút chót",
    ],
    demo: "Gắn nội dung với dịp lễ sắp tới. Khai thác cảm xúc mùa vụ. Đưa giá trị cụ thể (gợi ý quà, checklist). Kêu gọi hành động kịp thời.",
  },

  /* -------------------- Khám phá & Độc lạ -------------------- */
  dramatic: {
    whyViral:
      "Căng thẳng và cao trào khiến người xem 'nín thở' xem tiếp để biết kết cục.",
    whenToUse: "Khi câu chuyện có xung đột, bước ngoặt, kết bất ngờ.",
    examples: [
      "Tưởng mất trắng, ai ngờ 24h sau mọi thứ lật ngược",
      "Cuộc gọi lúc 2 giờ sáng thay đổi tất cả",
    ],
    demo: "Mở bằng khoảnh khắc căng nhất. Kéo ngược lại kể vì sao. Dồn nhịp tới cao trào. Tung cú lật ở cuối.",
  },
  kol: {
    whyViral:
      "Mượn sức ảnh hưởng của người nổi tiếng giúp nội dung dễ được chú ý và tin tưởng hơn.",
    whenToUse: "Khi có phát ngôn/câu chuyện của KOL liên quan chủ đề của bạn.",
    examples: [
      "[Người nổi tiếng] từng nói câu này, và nó đúng đến rợn người",
      "Bài học triệu đô từ thất bại của [KOL]",
    ],
    demo: "Trích một phát ngôn/câu chuyện của người ảnh hưởng (hợp lý, không mạo danh). Phân tích vì sao đáng học. Áp vào tình huống của người xem.",
  },
  journey: {
    whyViral:
      "Câu chuyện 'từ số 0' nuôi hy vọng và cảm giác đồng hành — người xem theo dõi để tiếp lửa cho chính mình.",
    whenToUse: "Khi bạn hoặc nhân vật có hành trình thay đổi rõ rệt.",
    examples: [
      "Từ 0 đồng đến cửa hàng đầu tiên: 365 ngày",
      "Ngày đầu tôi quay video có 3 view — và hôm nay",
    ],
    demo: "Bắt đầu ở điểm thấp nhất. Kể các cột mốc + khó khăn. Bước ngoặt. Kết ở hiện tại + lời nhắn cho người đang bắt đầu.",
  },
  weird: {
    whyViral:
      "Cái lạ phá vỡ dự đoán của não → phản xạ 'ơ cái gì vậy?' khiến người xem dừng lại và xem.",
    whenToUse: "Khi có hiện tượng/sự thật kỳ lạ, hiếm gặp để kể.",
    examples: [
      "Ngôi làng cả đời không dùng tiền mặt",
      "Món ăn nghe rùng mình nhưng ăn là nghiện",
    ],
    demo: "Tung ngay điều kỳ lạ ở hook. Cho vài chi tiết khó tin (có thật). Giải thích vì sao. Chốt bằng một câu khiến người xem muốn kể lại.",
  },
  secret: {
    whyViral:
      "Cảm giác 'được biết bí mật người khác không biết' tạo giá trị và thúc đẩy chia sẻ.",
    whenToUse: "Khi bạn biết góc khuất của một ngành/hiện tượng.",
    examples: [
      "Sự thật ít ai kể về nghề [ngành của bạn]",
      "Vì sao siêu thị luôn để sữa ở cuối cửa hàng?",
    ],
    demo: "Hook kiểu 'người trong nghề mới biết'. Tiết lộ một góc khuất cụ thể. Giải thích cơ chế đằng sau. Mời người xem lưu lại để không bị 'qua mặt'.",
  },
  quiz: {
    whyViral:
      "Câu hỏi mở kích hoạt nhu cầu trả lời → bình luận tăng vọt, thuật toán đẩy mạnh.",
    whenToUse: "Khi muốn tăng tương tác và hiểu khán giả.",
    examples: [
      "Đố bạn: 1 quả trứng luộc mấy phút là chuẩn? (đáp án gây tranh cãi)",
      "Bạn thuộc kiểu người nào trong 3 kiểu này?",
    ],
    demo: "Đặt một câu hỏi/đố dễ gây tranh luận. Cho vài lựa chọn. Mời người xem trả lời ở bình luận. Hé lộ đáp án ở video sau để giữ chân.",
  },
};

export const getConceptDetail = (id: string): ConceptDetail | undefined =>
  CONCEPT_DETAILS[id];
