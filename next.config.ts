import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // One canonical host (spektre.org). Every alias 308s there — no
    // duplicate-content hosts serving 200.
    const hosts = ["www.spektre.org", "spektrelabs.org", "www.spektrelabs.org"];
    return hosts.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://spektre.org/:path*",
      permanent: true,
    }));
  },
};

export default nextConfig;
