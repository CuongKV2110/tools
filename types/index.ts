import type { Timestamp } from "firebase/firestore";

/* ------------------------------------------------------------------ */
/*  Users                                                              */
/* ------------------------------------------------------------------ */
export type AuthProviderId = "password" | "google";

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  provider: AuthProviderId;
  plan: "free" | "pro";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/* ------------------------------------------------------------------ */
/*  Content generation                                                 */
/* ------------------------------------------------------------------ */
export type ContentStatus = "draft" | "published" | "archived";
export type ContentLength = "short" | "medium" | "long";
export type ContentTone =
  | "friendly"
  | "professional"
  | "inspirational"
  | "witty"
  | "authoritative";

export interface ContentDoc {
  id: string;
  ownerId: string;
  title: string;
  rawInput: string;
  body: string;
  personaId: string;
  /** Tuyến nội dung / lĩnh vực (id trong TOPICS). */
  topicId?: string;
  conceptId: string;
  /** Optional free-text storytelling formula (a custom prompt from the user). */
  formula?: string;
  tone: ContentTone;
  length: ContentLength;
  status: ContentStatus;
  publicUrl: string | null;
  wordCount: number;
  model: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** Payload sent to POST /api/generate */
export interface GenerateRequest {
  rawInput: string;
  personaId: string;
  topicId?: string;
  conceptId: string;
  /** Free-text storytelling formula; when present it steers the narrative. */
  formula?: string;
  tone: ContentTone;
  length: ContentLength;
}

/* ------------------------------------------------------------------ */
/*  "Chất liệu bản thân" — audience & customer-portrait analysis       */
/* ------------------------------------------------------------------ */
export interface MaterialRequest {
  /** Tên sản phẩm / kênh / thương hiệu cá nhân. */
  productName: string;
  /** Mô tả chi tiết: câu chuyện, con người, sản phẩm — "chất liệu". */
  productDescription: string;
  /** (Tuỳ chọn) Nhóm người xem mục tiêu đã biết; để trống → AI tự xác định. */
  targetAudience?: string;
}

/** Payload sent to POST /api/script (HILLA video scripts). */
export interface VideoScriptRequest {
  /** Chân dung khách hàng mục tiêu (dán từ "Chất liệu bản thân" hoặc tự nhập). */
  customerPortrait: string;
  /** Ngành nghề + số năm kinh nghiệm — quyết định giọng viết. */
  industry: string;
}

/* ------------------------------------------------------------------ */
/*  Static config (personas / concepts)                                */
/* ------------------------------------------------------------------ */
export interface Persona {
  id: string;
  name: string;
  emoji: string;
  description: string;
  /** Injected into the system prompt to steer voice */
  promptFragment: string;
}

/** Tuyến nội dung / lĩnh vực (Nấu ăn, Gia đình, Làm đẹp…). */
export interface Topic {
  id: string;
  name: string;
  emoji: string;
  promptFragment: string;
}

export interface Concept {
  id: string;
  name: string;
  emoji: string;
  description: string;
  /** Nhóm concept (id trong CONCEPT_GROUPS) — dùng để hiển thị theo nhóm. */
  group: string;
  promptFragment: string;
}
