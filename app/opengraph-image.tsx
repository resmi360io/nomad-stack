import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.1,
            letterSpacing: "-1px",
            maxWidth: 900,
          }}
        >
          Real Cost of Receiving International Payments
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: "#94A3B8",
            marginTop: 32,
          }}
        >
          Compare Wise, Revolut, Payoneer, PayPal and more
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            fontSize: 24,
            color: "#64748B",
            fontWeight: 500,
          }}
        >
          paidacross.com
        </div>
      </div>
    ),
    { ...size }
  );
}
