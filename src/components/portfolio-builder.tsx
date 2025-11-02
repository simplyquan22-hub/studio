"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight } from "lucide-react";

const glassCardClasses = "bg-background/50 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/10";

const templates = {
  conservative: { stocks: 20, bonds: 70, alternatives: 10 },
  balanced: { stocks: 60, bonds: 30, alternatives: 10 },
  aggressive: { stocks: 90, bonds: 0, alternatives: 10 },
};

const availableTickers = [
    { value: 'AAPL', label: 'Apple Inc.', category: 'stocks' },
    { value: 'GOOGL', label: 'Alphabet Inc.', category: 'stocks' },
    { value: 'MSFT', label: 'Microsoft Corp.', category: 'stocks' },
    { value: 'AMZN', label: 'Amazon.com, Inc.', category: 'stocks' },
    { value: 'TSLA', label: 'Tesla, Inc.', category: 'stocks' },
    { value: 'BND', label: 'Vanguard Total Bond Market ETF', category: 'bonds' },
    { value: 'AGG', label: 'iShares Core U.S. Aggregate Bond ETF', category: 'bonds' },
    { value: 'VCIT', label: 'Vanguard Intermediate-Term Corporate Bond ETF', category: 'bonds' },
    { value: 'GLD', label: 'SPDR Gold Shares', category: 'alternatives' },
    { value: 'VNQ', label: 'Vanguard Real Estate ETF', category: 'alternatives' },
];

type Allocation = {
  stocks: number;
  bonds: number;
  alternatives: number;
};

type Ticker = {
  id: string;
  name: string;
  category: "stocks" | "bonds" | "alternatives";
  allocation: number;
};

export function PortfolioBuilder() {
  const router = useRouter();
  const [portfolioName, setPortfolioName] = React.useState("");
  const [allocation, setAllocation] = React.useState<Allocation>({ stocks: 60, bonds: 30, alternatives: 10 });
  const [selectedTickers, setSelectedTickers] = React.useState<Ticker[]>([]);

  const handleTemplateSelect = (template: "conservative" | "balanced" | "aggressive") => {
    setAllocation(templates[template]);
  };

  const handleSliderChange = (newValues: number[]) => {
    const [stocks, bonds] = newValues;
    const alternatives = 100 - stocks - bonds;
    if (alternatives >= 0) {
      setAllocation({ stocks, bonds, alternatives });
    }
  };
  
  const handleSingleSliderChange = (name: keyof Allocation, value: number) => {
    const otherSliders = Object.keys(allocation).filter(k => k !== name) as (keyof Allocation)[];
    const remaining = 100 - value;
    
    if (remaining < 0) return;

    const currentTotalOfOthers = otherSliders.reduce((sum, key) => sum + allocation[key], 0);

    let newAllocation: Partial<Allocation> = { [name]: value };

    if (currentTotalOfOthers > 0) {
        const ratio = remaining / currentTotalOfOthers;
        otherSliders.forEach(key => {
            newAllocation[key] = Math.round(allocation[key] * ratio);
        });
    } else {
        // distribute equally if others are 0
        const val = remaining / otherSliders.length;
        otherSliders.forEach(key => {
            newAllocation[key] = Math.round(val);
        });
    }

    // Adjust for rounding errors to ensure total is 100
    const total = Object.values(newAllocation).reduce((sum, v) => sum + (v || 0), 0);
    if(total !== 100) {
        const diff = 100-total;
        const keyToAdjust = otherSliders[0];
        if(newAllocation[keyToAdjust] !== undefined) {
             newAllocation[keyToAdjust]! += diff;
        }
    }
    
    setAllocation(newAllocation as Allocation);
};


  const handleAddTicker = (tickerValue: string) => {
    const tickerData = availableTickers.find(t => t.value === tickerValue);
    if (tickerData && !selectedTickers.find(t => t.id === tickerData.value)) {
      setSelectedTickers(prev => [
        ...prev,
        { id: tickerData.value, name: tickerData.label, category: tickerData.category as any, allocation: 0 }
      ]);
    }
  };

  const handleTickerAllocationChange = (tickerId: string, newAllocation: number) => {
    setSelectedTickers(prev => prev.map(t => t.id === tickerId ? { ...t, allocation: newAllocation } : t));
  };
  
  const getCategoryTickers = (category: keyof Allocation) => selectedTickers.filter(t => t.category === category);


  return (
    <div className="space-y-8">
      <Card className={glassCardClasses}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">1. Name Your Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="My First Roth IRA Portfolio"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            className="h-12 text-base md:text-sm"
          />
        </CardContent>
      </Card>

      <Card className={glassCardClasses}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">2. Choose a Template</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-12 text-base" onClick={() => handleTemplateSelect("conservative")}>Conservative</Button>
          <Button variant="outline" className="h-12 text-base" onClick={() => handleTemplateSelect("balanced")}>Balanced</Button>
          <Button variant="outline" className="h-12 text-base" onClick={() => handleTemplateSelect("aggressive")}>Aggressive</Button>
        </CardContent>
      </Card>

      <Card className={glassCardClasses}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">3. Adjust Allocation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="flex justify-between text-base"><span>Stocks</span><span>{allocation.stocks}%</span></Label>
            <Slider value={[allocation.stocks]} onValueChange={(v) => handleSingleSliderChange("stocks", v[0])} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <Label className="flex justify-between text-base"><span>Bonds</span><span>{allocation.bonds}%</span></Label>
            <Slider value={[allocation.bonds]} onValueChange={(v) => handleSingleSliderChange("bonds", v[0])} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <Label className="flex justify-between text-base"><span>Alternatives</span><span>{allocation.alternatives}%</span></Label>
            <Slider value={[allocation.alternatives]} onValueChange={(v) => handleSingleSliderChange("alternatives", v[0])} max={100} step={1} />
          </div>
        </CardContent>
      </Card>

       <Card className={glassCardClasses}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">4. Add Tickers</CardTitle>
        </CardHeader>
        <CardContent>
            <Select onValueChange={handleAddTicker}>
              <SelectTrigger className="h-12 text-base md:text-sm">
                <SelectValue placeholder="Search and add a ticker..." />
              </SelectTrigger>
              <SelectContent>
                {availableTickers.map(t => <SelectItem key={t.value} value={t.value}>{t.label} ({t.value})</SelectItem>)}
              </SelectContent>
            </Select>
        </CardContent>
      </Card>
      
      <Card className={glassCardClasses}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">5. Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Target Allocation</TableHead>
                        <TableHead>Tickers</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-semibold">Stocks</TableCell>
                        <TableCell>{allocation.stocks}%</TableCell>
                        <TableCell>
                            {getCategoryTickers("stocks").map(t => <div key={t.id}>{t.name}</div>)}
                        </TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-semibold">Bonds</TableCell>
                        <TableCell>{allocation.bonds}%</TableCell>
                        <TableCell>
                            {getCategoryTickers("bonds").map(t => <div key={t.id}>{t.name}</div>)}
                        </TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-semibold">Alternatives</TableCell>
                        <TableCell>{allocation.alternatives}%</TableCell>
                         <TableCell>
                            {getCategoryTickers("alternatives").map(t => <div key={t.id}>{t.name}</div>)}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={() => router.push("/calculator")} className="h-12 text-lg px-8">
          Project My Growth
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
