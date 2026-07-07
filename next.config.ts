import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // The x402 discovery descriptor is machine-read — serve it as JSON so
    // crawlers and agent tooling parse it, not as octet-stream.
    return [
      {
        source: "/.well-known/x402",
        headers: [
          { key: "Content-Type", value: "application/json; charset=utf-8" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      // Reference verifiers are source you read and drop in — serve them as
      // plain text (so a browser shows them) and allow cross-origin fetch.
      {
        source: "/verify.:ext(js|py|c)",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      {
        source: "/sigma-attest-spec.md",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      {
        source: "/.well-known/sigma-attest-vectors.json",
        headers: [
          { key: "Content-Type", value: "application/json; charset=utf-8" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      {
        source: "/.well-known/railo-integrity.json",
        headers: [
          { key: "Content-Type", value: "application/json; charset=utf-8" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
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
