import { ImageResponse } from "next/og";

export const ogImageSize = {
  width: 1200,
  height: 630,
};

export const ogContentType = "image/png";

export function createOgImage({
  eyebrow,
  title,
  description,
  footer,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  footer: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "#000000",
          color: "#e8eaee",
          fontFamily:
            'ui-monospace, "SF Mono", "Fira Mono", "Cascadia Code", Menlo, monospace',
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Hairline outer frame */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            border: "1px solid rgba(232,234,238,0.18)",
            display: "flex",
          }}
        />
        {/* Inner frame */}
        <div
          style={{
            position: "absolute",
            inset: "28px",
            border: "1px solid rgba(207,227,255,0.07)",
            display: "flex",
          }}
        />

        {/* Signal glow — cold blue radial, centered, subtle */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "900px",
            height: "500px",
            marginTop: "-250px",
            marginLeft: "-450px",
            background:
              "radial-gradient(ellipse at center, rgba(207,227,255,0.055) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Symmetric Atlantean seal — centered, radial rings + diamond */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-108px",
            marginLeft: "-108px",
            width: "216px",
            height: "216px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* SVG seal: 3 concentric rings + 4-point diamond, all symmetric */}
          <svg
            width="216"
            height="216"
            viewBox="0 0 216 216"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer ring */}
            <circle
              cx="108"
              cy="108"
              r="100"
              stroke="rgba(232,234,238,0.22)"
              strokeWidth="1"
            />
            {/* Middle ring */}
            <circle
              cx="108"
              cy="108"
              r="80"
              stroke="rgba(207,227,255,0.18)"
              strokeWidth="0.75"
            />
            {/* Inner ring */}
            <circle
              cx="108"
              cy="108"
              r="60"
              stroke="rgba(232,234,238,0.14)"
              strokeWidth="0.75"
            />
            {/* Innermost ring */}
            <circle
              cx="108"
              cy="108"
              r="38"
              stroke="rgba(207,227,255,0.12)"
              strokeWidth="0.5"
            />
            {/* 4-point diamond — bilaterally symmetric */}
            <polygon
              points="108,60 148,108 108,156 68,108"
              stroke="rgba(207,227,255,0.55)"
              strokeWidth="0.75"
              fill="rgba(207,227,255,0.04)"
            />
            {/* Horizontal axis hairline */}
            <line
              x1="8"
              y1="108"
              x2="200"
              y2="108"
              stroke="rgba(232,234,238,0.08)"
              strokeWidth="0.5"
            />
            {/* Vertical axis hairline */}
            <line
              x1="108"
              y1="8"
              x2="108"
              y2="200"
              stroke="rgba(232,234,238,0.08)"
              strokeWidth="0.5"
            />
            {/* Center dot */}
            <circle cx="108" cy="108" r="2.5" fill="rgba(207,227,255,0.7)" />
            {/* Cardinal ticks — symmetric N/S/E/W */}
            <line x1="108" y1="8" x2="108" y2="20" stroke="rgba(207,227,255,0.4)" strokeWidth="1" />
            <line x1="108" y1="196" x2="108" y2="208" stroke="rgba(207,227,255,0.4)" strokeWidth="1" />
            <line x1="8" y1="108" x2="20" y2="108" stroke="rgba(207,227,255,0.4)" strokeWidth="1" />
            <line x1="196" y1="108" x2="208" y2="108" stroke="rgba(207,227,255,0.4)" strokeWidth="1" />
          </svg>
        </div>

        {/* Content layer — full card flex column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "52px 64px",
            position: "relative",
          }}
        >
          {/* Eyebrow / mono label top-left */}
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(136,141,151,0.9)",
            }}
          >
            {eyebrow}
          </div>

          {/* Title — large platinum gradient, centered vertically in remaining space */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 20,
              maxWidth: 780,
            }}
          >
            <div
              style={{
                fontSize: description ? 64 : 72,
                lineHeight: 1.05,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                background: "linear-gradient(135deg, #e8eaee 0%, #c2c6cf 55%, #888d97 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {title}
            </div>
            {description ? (
              <div
                style={{
                  fontSize: 22,
                  lineHeight: 1.45,
                  color: "rgba(136,141,151,0.85)",
                  letterSpacing: "0.01em",
                  whiteSpace: "pre-wrap",
                  maxWidth: 700,
                }}
              >
                {description}
              </div>
            ) : null}
          </div>

          {/* Bottom: mono label row + footer */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* Brand mono label */}
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(207,227,255,0.5)",
              }}
            >
              SPEKTRE LABS · 1 = 1 · spektrelabs.org
            </div>
            {/* Footer */}
            <div
              style={{
                fontSize: 14,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(136,141,151,0.6)",
              }}
            >
              {footer}
            </div>
          </div>
        </div>
      </div>
    ),
    ogImageSize
  );
}
