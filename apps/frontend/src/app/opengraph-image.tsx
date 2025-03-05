import { ImageResponse } from "next/og";
import LogoIcon from "@/components/icons/logo";

export const runtime = "edge";

export const alt = "Kurta MY";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          padding: "40px",
        }}
      >
        <LogoIcon width={200} height={200} />
        <div
          style={{
            marginTop: 20,
            fontSize: 48,
            fontWeight: 600,
            letterSpacing: -1,
            background: "black",
            color: "white",
            padding: "4px 16px",
            borderRadius: "4px",
          }}
        >
          Kurta MY
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
