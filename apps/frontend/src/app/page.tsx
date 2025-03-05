import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { HeroButton } from "@/components/ui/scroll-button";
import { MarqueeBanner } from "@/components/ui/marquee-banner";
import { ShoppingBag, Star, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import { ProductCarousel } from "@/components/ui/product-carousel";
import { ProductCard } from "@/components/ui/product-card";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero.png"
            alt="Hero image"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Content */}
        <div className="relative h-full w-full">
          <div className="mx-auto h-full px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-end h-full pb-12">
              <div className="max-w-full">
                <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight font-bold tracking-tight text-white text-center">
                  Kurta Gorilla:
                  <br />
                  Kurta Moden Klasik
                </h1>
                <p className="mt-4 text-sm md:text-base leading-relaxed text-neutral-100 max-w-[600px] text-center mx-auto">
                  Gaya Raya bersama Gorilla, dengan koleksi "limited edition"
                  kurta moden klasik. Dengan reka bentuk modern tradisional,
                  material berkualiti tinggi, dan tanpa batasan saiz.
                </p>
              </div>
              <div className="mt-6 flex justify-center gap-3">
                <HeroButton variant="scroll" label="SHOP NOW" />
                <HeroButton variant="link" label="A CLOSER LOOK" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:bg-white/10 rounded-full transition-colors">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full transition-colors">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Sale Banner */}
      <MarqueeBanner />

      {/* Featured Collections */}
      <Section className="!pt-0">
        <Container className="!pt-0">
          <div className="py-24">
            <h2 className="text-3xl font-bold text-center mb-4">
              Featured Collections
            </h2>
            <p className="text-neutral-600 text-center mb-12 max-w-2xl mx-auto">
              Explore our curated collections of premium kurtas
            </p>
            <BentoGrid columns={3}>
              {[
                {
                  title: "Modern Essentials Collection",
                  description: "Minimalist designs for the contemporary man",
                  image: "/images/products/collection-1.jpg",
                  className: "aspect-[3/4]",
                },
                {
                  title: "Traditional Heritage Series",
                  description: "Timeless patterns with modern comfort",
                  image: "/images/products/collection-2.jpg",
                  className: "aspect-[3/4]",
                },
                {
                  title: "Premium Luxury Line",
                  description: "Exquisite fabrics with superior craftsmanship",
                  image: "/images/products/collection-3.jpg",
                  className: "aspect-[3/4]",
                },
              ].map((collection, i) => (
                <BentoGridItem
                  key={i}
                  title={collection.title}
                  description={collection.description}
                  className={collection.className}
                  image={collection.image}
                />
              ))}
            </BentoGrid>
          </div>
        </Container>
      </Section>

      {/* New Arrivals Carousel */}
      <Section className="bg-black">
        <Container>
          <div className="py-20">
            <h2 className="text-2xl font-medium text-center mb-2 text-white uppercase tracking-wide">
              New Arrivals
            </h2>
            <p className="text-neutral-400 text-center mb-12 text-sm tracking-wide">
              Discover our latest kurta collections
            </p>
            <div className="px-4">
              <ProductCarousel>
                {[
                  {
                    title: "Classic Kurta - Black",
                    price: "RM 150.00 MYR",
                    image: "/images/products/kurta-1.jpg",
                    colors: ["black", "white", "gray"],
                  },
                  {
                    title: "Classic Kurta - White",
                    price: "RM 150.00 MYR",
                    image: "/images/products/kurta-2.jpg",
                    colors: ["white", "black", "gray"],
                  },
                  {
                    title: "Classic Kurta - Gray",
                    price: "RM 150.00 MYR",
                    image: "/images/products/kurta-3.jpg",
                    colors: ["gray", "black", "white"],
                    soldOut: true,
                  },
                  {
                    title: "Classic Kurta - Navy",
                    price: "RM 150.00 MYR",
                    image: "/images/products/kurta-4.jpg",
                    colors: ["black", "white"],
                  },
                ].map((product, i) => (
                  <div
                    key={i}
                    className="flex-[0_0_90%] min-w-0 pl-4 pr-12 first:pl-0 last:pr-4"
                  >
                    <ProductCard {...product} className="bg-black" />
                  </div>
                ))}
              </ProductCarousel>
            </div>
            <div className="flex justify-center mt-12">
              <button className="border border-white text-white px-12 py-2 text-sm uppercase tracking-wide hover:bg-white hover:text-black transition-colors">
                Shop All
              </button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section>
        <Container>
          <div className="py-24">
            <h2 className="text-3xl font-bold text-center mb-4">
              Why Choose Us
            </h2>
            <p className="text-neutral-600 text-center mb-12 max-w-2xl mx-auto">
              Experience the Kurta Gorilla difference
            </p>
            <BentoGrid columns={4}>
              <BentoGridItem
                title="Premium Quality"
                description="Handcrafted with the finest materials"
                icon={<Star className="w-6 h-6" />}
              />
              <BentoGridItem
                title="Trending Styles"
                description="Latest designs from top artisans"
                icon={<TrendingUp className="w-6 h-6" />}
              />
              <BentoGridItem
                title="Customer First"
                description="Dedicated support and easy returns"
                icon={<Users className="w-6 h-6" />}
              />
              <BentoGridItem
                title="Fast Delivery"
                description="Quick and secure shipping"
                icon={<ShoppingBag className="w-6 h-6" />}
              />
            </BentoGrid>
          </div>
        </Container>
      </Section>

      {/* Style Guide */}
      <Section className="bg-neutral-50">
        <Container>
          <div className="py-24">
            <h2 className="text-3xl font-bold text-center mb-4">Style Guide</h2>
            <p className="text-neutral-600 text-center mb-12 max-w-2xl mx-auto">
              Tips, trends, and styling inspiration
            </p>
            <BentoGrid columns={3}>
              {[1, 2, 3].map((i) => (
                <BentoGridItem
                  key={i}
                  title={`Style Tip ${i}`}
                  description="Learn how to style your kurta for different occasions"
                />
              ))}
            </BentoGrid>
          </div>
        </Container>
      </Section>
    </>
  );
}
