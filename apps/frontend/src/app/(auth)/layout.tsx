import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import LogoIcon from "@/components/icons/logo";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6">
        <Container>
          <Link href="/" className="flex items-center justify-center space-x-2">
            <LogoIcon className="h-8 w-8" />
            <span className="text-xl font-bold">Kurta MY</span>
          </Link>
        </Container>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <Section>
          <Container>{children}</Container>
        </Section>
      </main>

      <footer className="py-6">
        <Container>
          <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} Kurta MY. All rights reserved.
          </p>
        </Container>
      </footer>
    </div>
  );
}
