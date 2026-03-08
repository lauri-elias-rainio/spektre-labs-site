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
          background: "#ffffff",
          color: "#111111",
          padding: "56px 64px",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            border: "1px solid rgba(17,17,17,0.12)",
            padding: "48px",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(17,17,17,0.6)",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              maxWidth: 860,
            }}
          >
            <div style={{ fontSize: 72, lineHeight: 1.02, fontWeight: 600 }}>
              {title}
            </div>
            {description ? (
              <div
                style={{
                  fontSize: 30,
                  lineHeight: 1.35,
                  color: "rgba(17,17,17,0.72)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {description}
              </div>
            ) : null}
          </div>
          <div style={{ fontSize: 20, color: "rgba(17,17,17,0.6)" }}>{footer}</div>
        </div>
      </div>
    ),
    ogImageSize
  );
}

