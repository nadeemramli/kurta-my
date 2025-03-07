import { cn } from "@kurta-my/utils";
import Image from "next/image";
import Link from "next/link";

interface TileProps {
  item: {
    title: string;
    href: `/${string}`;
    description?: string;
    image?: {
      src: string;
      alt?: string;
    };
  };
  size?: "default" | "large";
}

interface GridTileImageProps {
  src: string | undefined;
  alt: string | undefined;
  label: {
    title: string;
    amount: number;
    currencyCode: string;
  };
  sizes?: string;
}

export function GridTileImage({
  src,
  alt,
  label,
  sizes = "100vw",
}: GridTileImageProps) {
  return (
    <div className="group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-blue-600 dark:bg-black">
      {src && (
        <Image
          className="relative h-full w-full object-contain transition duration-300 ease-in-out group-hover:scale-105"
          src={src}
          alt={alt || label.title}
          sizes={sizes}
          fill
        />
      )}
      <div className="absolute bottom-0 left-0 flex w-full flex-col items-start rounded-b-lg bg-gradient-to-t from-black p-4">
        <div className="flex w-full justify-between">
          <h3 className="text-md font-medium text-white">{label.title}</h3>
          <p className="text-md font-medium text-white">
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: label.currencyCode,
              currencyDisplay: "narrowSymbol",
            }).format(label.amount)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Tile({ item, size = "default" }: TileProps) {
  return (
    <Link
      className={cn("group relative block h-full w-full", {
        "aspect-square md:aspect-[2.4/1]": size === "large",
        "aspect-square": size === "default",
      })}
      href={item.href}
    >
      <div className="absolute inset-0 h-full w-full">
        {item.image && (
          <Image
            src={item.image.src}
            alt={item.image.alt || item.title}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            fill
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity group-hover:bg-opacity-30" />
      </div>
      <div className="relative flex h-full items-center justify-center p-4 text-center">
        <div>
          <h3 className="text-xl font-medium text-white">{item.title}</h3>
          {item.description && (
            <p className="mt-2 text-sm text-white">{item.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
