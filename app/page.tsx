import { redirect } from "next/navigation";

export default function Home() {
  // Auth is handled client-side; the dashboard guard redirects to /login
  // when there is no session.
  redirect("/dashboard");
}
