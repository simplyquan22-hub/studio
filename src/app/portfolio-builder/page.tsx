import { PortfolioBuilder } from "@/components/portfolio-builder";

export default function PortfolioBuilderPage() {
  return (
    <main className="relative w-full bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
            Portfolio Builder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
            Design a portfolio that matches your risk tolerance and financial goals.
          </p>
        </div>
        <PortfolioBuilder />
      </div>
    </main>
  );
}
