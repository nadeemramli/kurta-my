import clsx from "clsx";
import Image from "next/image";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: number;
    currencyCode: string;
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        "group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-blue-600 dark:bg-black",
        {
          relative: label,
          "border-2 border-blue-600": active,
          "border-neutral-200 dark:border-neutral-800": !active,
        }
      )}
    >
      {props.src ? (
        <Image
          className={clsx("relative h-full w-full object-contain", {
            "transition duration-300 ease-in-out group-hover:scale-105":
              isInteractive,
          })}
          {...props}
          width={props.width || 800}
          height={props.height || 800}
          quality={85}
          priority={true}
        />
      ) : null}
      {label ? (
        <div className="absolute bottom-0 left-0 flex w-full flex-col items-start rounded-b-lg bg-black/40 p-2 text-white backdrop-blur-md">
          <p className="text-sm font-medium">{label.title}</p>
          <p className="text-xs font-medium">
            {label.currencyCode} {label.amount}
          </p>
        </div>
      ) : null}
    </div>
  );
}
