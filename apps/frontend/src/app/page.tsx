import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { HeroButton } from "@/components/ui/scroll-button";
import { ShoppingBag, Star, TrendingUp, Users } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[65vh] w-full">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero.png"
            alt="Hero image"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
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

      {/* Features Section */}
      <Section>
        <Container>
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
        </Container>
      </Section>

      {/* Featured Products */}
      <Section
        id="featured-products"
        title="Featured Products"
        description="Our most popular kurtas, handpicked for you"
      >
        <Container>
          <BentoGrid columns={3}>
            {/* TODO: Add ProductCard components here */}
            {[1, 2, 3].map((i) => (
              <BentoGridItem
                key={i}
                className="aspect-[3/4]"
                title={`Featured Kurta ${i}`}
                description="Premium cotton kurta with traditional embroidery"
              />
            ))}
          </BentoGrid>
        </Container>
      </Section>

      {/* Categories */}
      <Section
        title="Shop by Category"
        description="Explore our wide range of traditional and modern kurtas"
      >
        <Container>
          <BentoGrid columns={2}>
            <BentoGridItem
              size="lg"
              title="Traditional Collection"
              description="Timeless designs that celebrate heritage"
            />
            <BentoGridItem
              size="lg"
              title="Modern Collection"
              description="Contemporary styles for the modern wardrobe"
            />
          </BentoGrid>
        </Container>
      </Section>

      {/* Blog Preview */}
      <Section
        title="Style Guide"
        description="Tips, trends, and styling inspiration"
      >
        <Container>
          <BentoGrid columns={3}>
            {[1, 2, 3].map((i) => (
              <BentoGridItem
                key={i}
                title={`Style Tip ${i}`}
                description="Learn how to style your kurta for different occasions"
              />
            ))}
          </BentoGrid>
        </Container>
      </Section>
    </>
  );
}
