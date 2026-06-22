import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: 180,
          height: 180,
          background: "#ffffff",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Spektre "S" mark — mirrors the icon.svg path */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width={120}
          height={120}
        >
          <path
            d="M18 18H46V24H24V29H40C45.523 29 50 33.477 50 39C50 44.523 45.523 49 40 49H18V43H40C42.209 43 44 41.209 44 39C44 36.791 42.209 35 40 35H18V18Z"
            fill="#111111"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
