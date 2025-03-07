import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}

const sizes = {
  sm: 32,
  md: 48,
  lg: 64,
};

export function Logo({
  className = "",
  size = "md",
  priority = false,
}: LogoProps) {
  const dimension = sizes[size];

  return (
    <Image
      src="/logo.png"
      alt="Kurta MY"
      width={dimension}
      height={dimension}
      className={`rounded-xl ${className}`}
      priority={priority}
      style={{ width: dimension, height: dimension }}
    />
  );
}
