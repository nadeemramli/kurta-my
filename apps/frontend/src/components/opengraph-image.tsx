import { ImageResponse } from "next/og";
import LogoIcon from "./icons/logo";

export type Props = {
  title?: string;
};

export default function OpengraphImage({ title }: Props) {
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
        {title && (
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
            {title}
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
