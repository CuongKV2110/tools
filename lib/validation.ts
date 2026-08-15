/** Client-side form validation helpers for the auth screens. */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns an error message, or null if valid. */
export function validateEmail(value: string): string | null {
  const v = value.trim();
  if (!v) return "Vui lòng nhập email.";
  if (!EMAIL_RE.test(v)) return "Email không hợp lệ (thiếu @ hoặc tên miền).";
  return null;
}

/** Login: password just needs to be present. */
export function validateLoginPassword(value: string): string | null {
  if (!value) return "Vui lòng nhập mật khẩu.";
  return null;
}

/** Register: enforce minimum length + at least letters and numbers. */
export function validateNewPassword(value: string): string | null {
  if (!value) return "Vui lòng nhập mật khẩu.";
  if (value.length < 6) return "Mật khẩu tối thiểu 6 ký tự.";
  if (!/[a-zA-Z]/.test(value) || !/\d/.test(value))
    return "Mật khẩu nên có cả chữ và số.";
  return null;
}

export function validateName(value: string): string | null {
  if (!value.trim()) return "Vui lòng nhập họ và tên.";
  if (value.trim().length < 2) return "Tên quá ngắn.";
  return null;
}

export interface PasswordStrength {
  /** 0–4 */
  score: number;
  label: string;
  /** Tailwind classes for the meter fill. */
  barClass: string;
  textClass: string;
}

/** Rough password strength meter (0–4). */
export function passwordStrength(value: string): PasswordStrength {
  let s = 0;
  if (value.length >= 6) s++;
  if (value.length >= 10) s++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) s++;
  if (/\d/.test(value)) s++;
  if (/[^A-Za-z0-9]/.test(value)) s++;
  const score = Math.min(4, s);

  const table: Omit<PasswordStrength, "score">[] = [
    { label: "Rất yếu", barClass: "bg-rose-500", textClass: "text-rose-500" },
    { label: "Yếu", barClass: "bg-rose-500", textClass: "text-rose-500" },
    { label: "Trung bình", barClass: "bg-amber-500", textClass: "text-amber-500" },
    { label: "Khá", barClass: "bg-lime-500", textClass: "text-lime-600" },
    { label: "Mạnh", barClass: "bg-emerald-500", textClass: "text-emerald-600" },
  ];
  return { score, ...table[score] };
}
