import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Firebase's Google sign-in popup to communicate back to the opener.
  // Without this, Chrome's default Cross-Origin-Opener-Policy can block the
  // popup result from reaching the app, leaving the sign-in spinner stuck.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
