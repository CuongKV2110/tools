/** Map Firebase Auth error codes to friendly Vietnamese messages. */
const MESSAGES: Record<string, string> = {
  "auth/invalid-email": "Email không hợp lệ.",
  "auth/user-disabled": "Tài khoản đã bị vô hiệu hoá.",
  "auth/user-not-found": "Không tìm thấy tài khoản với email này.",
  "auth/wrong-password": "Mật khẩu không đúng.",
  "auth/invalid-credential": "Email hoặc mật khẩu không đúng.",
  "auth/email-already-in-use": "Email này đã được đăng ký.",
  "auth/weak-password": "Mật khẩu quá yếu (tối thiểu 6 ký tự).",
  "auth/popup-closed-by-user": "Bạn đã đóng cửa sổ đăng nhập.",
  "auth/too-many-requests": "Bạn thử quá nhiều lần. Vui lòng thử lại sau.",
  "auth/network-request-failed": "Lỗi kết nối mạng.",
};

export function authErrorMessage(err: unknown): string {
  const code =
    typeof err === "object" && err !== null && "code" in err
      ? String((err as { code: unknown }).code)
      : "";
  return MESSAGES[code] ?? "Đã có lỗi xảy ra. Vui lòng thử lại.";
}
