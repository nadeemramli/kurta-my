import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { defaultSort, sorting } from "@/lib/constants";
import { mockProducts } from "@/lib/mock-data";

export const runtime = "edge";

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function HomePage() {
  // Replace the products array with our mock data
  // Later this will be fetched from the admin backend
  const products = mockProducts.map((product) => ({
    ...product,
    images: product.images.map((image) => ({
      ...image,
      // Temporarily use our placeholder SVG until admin backend is ready
      url: "/images/products/placeholder.svg",
    })),
  }));

  return (
    <>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black dark:text-white md:flex-row">
        <div className="order-first w-full flex-none md:max-w-[125px]">
          {/* Add filters here */}
        </div>
        <div className="order-last min-h-screen w-full md:order-none">
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>
        </div>
      </div>
    </>
  );
}
