import Image from "next/image";
import { WealthCalculator } from "@/components/wealth-calculator";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CalculatorGuide } from "@/components/calculator-guide";

export default function CalculatorPage() {
  const bgImage = PlaceHolderImages.find(p => p.id === "1");

  return (
    <main className="relative min-h-screen w-full bg-background text-foreground">
      {bgImage && (
         <div className="absolute inset-0 -z-10 h-full w-full">
            <Image
              src={bgImage.imageUrl}
              alt={bgImage.description}
              fill
              priority
              className="object-cover opacity-10"
              data-ai-hint={bgImage.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
          </div>
      )}
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
            WealthPath Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
            Chart your financial future. See how your investments can grow over time with the power of compound interest.
          </p>
        </div>
        <WealthCalculator />
        <CalculatorGuide />
      </div>
    </main>
  );
}
