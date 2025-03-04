import clsx from "clsx";
import { type ComponentProps } from "react";

function Grid(props: ComponentProps<"ul">) {
  const { children, className, ...rest } = props;
  return (
    <ul {...rest} className={clsx("grid grid-flow-row gap-4", className)}>
      {children}
    </ul>
  );
}

function GridItem(props: ComponentProps<"li">) {
  const { children, className, ...rest } = props;
  return (
    <li
      {...rest}
      className={clsx("aspect-square transition-opacity", className)}
    >
      {children}
    </li>
  );
}

Grid.Item = GridItem;

export default Grid;
