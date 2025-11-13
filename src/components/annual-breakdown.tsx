
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { InvestmentData } from "@/components/wealth-calculator";
import { Card, CardContent } from "./ui/card";
import { Info } from "lucide-react";

interface AnnualBreakdownProps {
  data: InvestmentData[];
  adjustForInflation: boolean;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

export function AnnualBreakdown({ data, adjustForInflation }: AnnualBreakdownProps) {
  return (
    <Accordion type="single" collapsible className="w-full mt-8">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg font-medium font-headline">
          View Annual Breakdown
        </AccordionTrigger>
        <AccordionContent>
           <Card className="bg-background/30 border-white/10 p-4 mb-6">
            <CardContent className="p-0">
                <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0"/>
                    <div>
                        <h4 className="font-semibold mb-2">How are "Returns" calculated?</h4>
                        <div className="text-muted-foreground text-sm space-y-2">
                           <p>For any given year, the annual return is calculated like this:</p>
                           <p className="pl-4 italic border-l-2 border-primary/50">
                             (End Value of Current Year) - (End Value of Previous Year) - (Contributions Made During Current Year)
                           </p>
                           <p>
                            The number that's left is the amount your money earned all by itself through compounding interest during that 12-month period.
                           </p>
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>
          <div className="max-h-96 overflow-y-auto pr-2">
            <Table>
              <TableHeader className="sticky top-0 bg-background/80 backdrop-blur-sm">
                <TableRow>
                  <TableHead className="w-[100px]">Year</TableHead>
                  <TableHead>Contributions</TableHead>
                  <TableHead>Returns</TableHead>
                  <TableHead className="text-right">End Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => {
                    const displayValue = adjustForInflation ? item.inflationAdjustedValue : item.projectedValue;
                    return (
                        <TableRow key={item.year}>
                            <TableCell className="font-medium">{item.year}</TableCell>
                            <TableCell>{formatCurrency(item.annualContributions)}</TableCell>
                            <TableCell className={item.annualReturns >= 0 ? "text-green-400" : "text-destructive"}>{formatCurrency(item.annualReturns)}</TableCell>
                            <TableCell className="text-right font-semibold">{formatCurrency(displayValue)}</TableCell>
                        </TableRow>
                    )
                })}
              </TableBody>
            </Table>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

    