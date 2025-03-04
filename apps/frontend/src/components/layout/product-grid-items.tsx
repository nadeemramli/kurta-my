import Grid from "../grid";
import { Product } from "@/lib/types";
import Link from "next/link";
import { GridTileImage } from "./grid/tile";

export default function ProductGridItems({
  products,
}: {
  products: Product[];
}) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.id} className="animate-fadeIn">
          <Link
            className="relative inline-block h-full w-full"
            href={`/product/${product.id}`}
          >
            <GridTileImage
              alt={product.images[0]?.altText}
              label={{
                title: product.name,
                amount: product.price.amount,
                currencyCode: product.price.currencyCode,
              }}
              src={product.images[0]?.url}
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
