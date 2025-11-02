"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, Trash2 } from "lucide-react";

const glassCardClasses = "bg-background/50 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/10";

const templates = {
  conservative: { stocks: 20, bonds: 70, alternatives: 10 },
  balanced: { stocks: 60, bonds: 30, alternatives: 10 },
  aggressive: { stocks: 90, bonds: 0, alternatives: 10 },
};

const availableTickers = [
    { value: 'AAPL', label: 'Apple Inc.', category: 'stocks', group: 'Stocks' },
    { value: 'MSFT', label: 'Microsoft Corp.', category: 'stocks', group: 'Stocks' },
    { value: 'GOOGL', label: 'Alphabet Inc.', category: 'stocks', group: 'Stocks' },
    { value: 'AMZN', label: 'Amazon.com Inc.', category: 'stocks', group: 'Stocks' },
    { value: 'NVDA', label: 'NVIDIA Corp.', category: 'stocks', group: 'Stocks' },
    { value: 'META', label: 'Meta Platforms Inc.', category: 'stocks', group: 'Stocks' },
    { value: 'TSLA', label: 'Tesla Inc.', category: 'stocks', group: 'Stocks' },
    { value: 'JPM', label: 'JPMorgan Chase & Co.', category: 'stocks', group: 'Stocks' },
    { value伴: 'UNH', label: 'UnitedHealth Group', category: 'stocks', group: 'Stocks' },
    { value: 'XOM', label: 'Exxon Mobil Corp.', category: 'stocks', group: 'Stocks' },
    { value: 'V', label: 'Visa Inc.', category: 'stocks', group: 'Stocks' },
    { value: 'PG', label: 'Procter & Gamble', category: 'stocks', group: 'Stocks' },
    { value: 'JNJ', label: 'Johnson & Johnson', category: 'stocks', group: 'Stocks' },
    { value: 'NKE', label: 'Nike Inc.', category: 'stocks', group: 'Stocks' },
    { value: 'DIS', label: 'Walt Disney Co.', category: 'stocks', group: 'Stocks' },
    { value: 'SPY', label: 'SPDR S&P 500 ETF', category: 'stocks', group: 'ETFs' },
    { value: 'VTI', label: 'Vanguard Total Stock Market ETF', category: 'stocks', group: 'ETFs' },
    { value: 'QQQ', label: 'Invesco QQQ Trust', category: 'stocks', group: 'ETFs' },
    { value: 'IVV', label: 'iShares Core S&P 500 ETF', category: 'stocks', group: 'ETFs' },
    { value: 'SCHB', label: 'Schwab U.S. Broad Market ETF', category: 'stocks', group: 'ETFs' },
    { value: 'XLK', label: 'Technology Select Sector SPDR Fund', category: 'stocks', group: 'ETFs' },
    { value: 'XLF', label: 'Financial Select Sector SPDR Fund', category: 'stocks', group: 'ETFs' },
    { value: 'XLE', label: 'Energy Select Sector SPDR Fund', category: 'stocks', group: 'ETFs' },
    { value: 'XLV', label: 'Health Care Select Sector SPDR Fund', category: 'stocks', group: 'ETFs' },
    { value: 'VXUS', label: 'Vanguard Total International Stock ETF', category: 'stocks', group: 'ETFs' },
    { value: 'EFA', label: 'iShares MSCI EAFE ETF', category: 'stocks', group: 'ETFs' },
    { value: 'EEM', label: 'iShares MSCI Emerging Markets ETF', category: 'stocks', group: 'ETFs' },
    { value: 'ARKK', label: 'ARK Innovation ETF', category: 'stocks', group: 'ETFs' },
    { value: 'VOO', label: 'Vanguard S&P 500 ETF', category: 'stocks', group: 'ETFs' },
    { value: 'IWM', label: 'iShares Russell 2000 ETF', category: 'stocks', group: 'ETFs' },
    { value: 'VFIAX', label: 'Vanguard 500 Index Fund Admiral Shares', category: 'stocks', group: 'Index Funds' },
    { value: 'FXAIX', label: 'Fidelity 500 Index Fund', category: 'stocks', group: 'Index Funds' },
    { value: 'SWPPX', label: 'Schwab S&P 500 Index Fund', category: 'stocks', group: 'Index Funds' },
    { value: 'VTSAX', label: 'Vanguard Total Stock Market Index Fund', category: 'stocks', group: 'Index Funds' },
    { value: 'FSKAX', label: 'Fidelity Total Market Index Fund', category: 'stocks', group: 'Index Funds' },
    { value: 'VTIAX', label: 'Vanguard Total International Stock Index Fund', category: 'stocks', group: 'Index Funds' },
    { value: 'VBTLX', label: 'Vanguard Total Bond Market Index Fund', category: 'stocks', group: 'Index Funds' },
    { value: 'VINIX', label: 'Vanguard Institutional Index Fund', category: 'stocks', group: 'Index Funds' },
    { value: 'FZROX', label: 'Fidelity ZERO Total Market Index Fund', category: 'stocks', group: 'Index Funds' },
    { value: 'SWISX', label: 'Schwab International Index Fund', category: 'stocks', group: 'Index Funds' },
    { value: 'VSMAX', label: 'Vanguard Small-Cap Index Fund', category: 'stocks', group: 'Index Funds' },
    { value: 'VSIAX', label: 'Vanguard Small-Cap Value Index Fund', category: 'stocks', group: 'Index Funds' },
    { value: 'VIGAX', label: 'Vanguard Growth Index Fund', category: 'stocks', group: 'Index Funds' },
    { value: 'VIMAX', label: 'Vanguard Mid-Cap Index Fund', category: 'stocks', group: 'Index Funds' },
    { value: 'FZILX', label: 'Fidelity ZERO International Index Fund', category: 'stocks', group: 'Index Funds' },
    { value: 'VTSMX', label: 'Vanguard Total Stock Market Fund Investor Shares', category: 'stocks', group: 'Mutual Funds' },
    { value: 'FDGRX', label: 'Fidelity Growth Company Fund', category: 'stocks', group: 'Mutual Funds' },
    { value: 'TRBCX', label: 'T. Rowe Price Blue Chip Growth Fund', category: 'stocks', group: 'Mutual Funds' },
    { value: 'AMCPX', label: 'American Funds AMCAP Fund', category: 'stocks', group: 'Mutual Funds' },
    { value: 'PRGFX', label: 'T. Rowe Price Growth Stock Fund', category: 'stocks', group: 'Mutual Funds' },
    { value: 'FMAGX', label: 'Fidelity Magellan Fund', category: 'stocks', group: 'Mutual Funds' },
    { value: 'DODGX', label: 'Dodge & Cox Stock Fund', category: 'stocks', group: 'Mutual Funds' },
    { value: 'VDIGX', label: 'Vanguard Dividend Growth Fund', category: 'stocks', group: 'Mutual Funds' },
    { value: 'VWELX', label: 'Vanguard Wellington Fund', category: 'stocks', group: 'Mutual Funds' },
    { value: 'FCNTX', label: 'Fidelity Contrafund', category: 'stocks', group: 'Mutual Funds' },
    { value: 'ANCFX', label: 'American Funds Fundamental Investors', category: 'stocks', group: 'Mutual Funds' },
    { value: 'AIVSX', label: 'American Funds Investment Company of America', category: 'stocks', group: 'Mutual Funds' },
    { value: 'FSPGX', label: 'Fidelity Large Cap Growth Index Fund', category: 'stocks', group: 'Mutual Funds' },
    { value: 'RERFX', label: 'American Funds EuroPacific Growth Fund', category: 'stocks', group: 'Mutual Funds' },
    { value: 'BND', label: 'Vanguard Total Bond Market ETF', category: 'bonds', group: 'Bonds' },
    { value: 'AGG', label: 'iShares Core U.S. Aggregate Bond ETF', category: 'bonds', group: 'Bonds' },
    { value: 'TLT', label: 'iShares 20+ Year Treasury Bond ETF', category: 'bonds', group: 'Bonds' },
    { value: 'IEF', label: 'iShares 7-10 Year Treasury Bond ETF', category: 'bonds', group: 'Bonds' },
    { value: 'SHY', label: 'iShares 1-3 Year Treasury Bond ETF', category: 'bonds', group: 'Bonds' },
    { value: 'HYG', label: 'iShares iBoxx High Yield Corporate Bond ETF', category: 'bonds', group: 'Bonds' },
    { value: 'LQD', label: 'iShares Investment Grade Corporate Bond ETF', category: 'bonds', group: 'Bonds' },
    { value: 'TIP', label: 'iShares TIPS Bond ETF', category: 'bonds', group: 'Bonds' },
    { value: 'GOVT', label: 'iShares U.S. Treasury Bond ETF', category: 'bonds', group: 'Bonds' },
    { value: 'MUB', label: 'iShares National Muni Bond ETF', category: 'bonds', group: 'Bonds' },
    { value: 'BSV', label: 'Vanguard Short-Term Bond ETF', category: 'bonds', group: 'Bonds' },
    { value: 'BLV', label: 'Vanguard Long-Term Bond ETF', category: 'bonds', group: 'Bonds' },
    { value: 'ZROZ', label: 'PIMCO 25+ Year Zero Coupon Treasury ETF', category: 'bonds', group: 'Bonds' },
    { value: 'EDV', label: 'Vanguard Extended Duration Treasury ETF', category: 'bonds', group: 'Bonds' },
    { value: 'IGSB', label: 'iShares Short-Term Corporate Bond ETF', category: 'bonds', group: 'Bonds' },
    { value: 'VNQ', label: 'Vanguard Real Estate ETF', category: 'alternatives', group: 'Real Estate' },
    { value: 'SCHH', label: 'Schwab U.S. REIT ETF', category: 'alternatives', group: 'Real Estate' },
    { value: 'IYR', label: 'iShares U.S. Real Estate ETF', category: 'alternatives', group: 'Real Estate' },
    { value: 'XLRE', label: 'Real Estate Select Sector SPDR Fund', category: 'alternatives', group: 'Real Estate' },
    { value: 'O', label: 'Realty Income Corp.', category: 'alternatives', group: 'Real Estate' },
    { value: 'AMT', label: 'American Tower Corp.', category: 'alternatives', group: 'Real Estate' },
    { value: 'PLD', label: 'Prologis Inc.', category: 'alternatives', group: 'Real Estate' },
    { value: 'SPG', label: 'Simon Property Group', category: 'alternatives', group: 'Real Estate' },
    { value: 'CCI', label: 'Crown Castle Inc.', category: 'alternatives', group: 'Real Estate' },
    { value: 'PSA', label: 'Public Storage', category: 'alternatives', group: 'Real Estate' },
    { value: 'EQR', label: 'Equity Residential', category: 'alternatives', group: 'Real Estate' },
    { value: 'WELL', label: 'Welltower Inc.', category: 'alternatives', group: 'Real Estate' },
    { value: 'AVB', label: 'AvalonBay Communities', category: 'alternatives', group: 'Real Estate' },
    { value: 'NLY', label: 'Annaly Capital Management', category: 'alternatives', group: 'Real Estate' },
    { value: 'STAG', label: 'STAG Industrial Inc.', category: 'alternatives', group: 'Real Estate' },
    { value: 'GLD', label: 'SPDR Gold Shares', category: 'alternatives', group: 'Commodities' },
    { value: 'SLV', label: 'iShares Silver Trust', category: 'alternatives', group: 'Commodities' },
    { value: 'PPLT', label: 'Physical Platinum Shares ETF', category: 'alternatives', group: 'Commodities' },
    { value: 'PALL', label: 'Physical Palladium Shares ETF', category: 'alternatives', group: 'Commodities' },
    { value: 'USO', label: 'United States Oil Fund', category: 'alternatives', group: 'Commodities' },
    { value: 'UNG', label: 'United States Natural Gas Fund', category: 'alternatives' , group: 'Commodities'},
    { value: 'DBA', label: 'Invesco DB Agriculture Fund', category: 'alternatives', group: 'Commodities' },
    { value: 'DBC', label: 'Invesco DB Commodity Index Tracking Fund', category: 'alternatives', group: 'Commodities' },
    { value: 'UGA', label: 'United States Gasoline Fund', category: 'alternatives', group: 'Commodities' },
    { value: 'WEAT', label: 'Teucrium Wheat Fund', category: 'alternatives', group: 'Commodities' },
    { value: 'CORN', label: 'Teucrium Corn Fund', category: 'alternatives', group: 'Commodities' },
    { value: 'SOYB', label: 'Teucrium Soybean Fund', category: 'alternatives', group: 'Commodities' },
    { value: 'CPER', label: 'United States Copper Index Fund', category: 'alternatives', group: 'Commodities' },
    { value: 'COMT', label: 'iShares GSCI Commodity ETF', category: 'alternatives', group: 'Commodities' },
    { value: 'GLDM', label: 'SPDR Gold MiniShares Trust', category: 'alternatives', group: 'Commodities' },
    { value: 'BTC', label: 'Bitcoin', category: 'alternatives', group: 'Crypto' },
    { value: 'ETH', label: 'Ethereum', category: 'alternatives', group: 'Crypto' },
    { value: 'SOL', label: 'Solana', category: 'alternatives', group: 'Crypto' },
    { value: 'ADA', label: 'Cardano', category: 'alternatives', group: 'Crypto' },
    { value: 'AVAX', label: 'Avalanche', category: 'alternatives', group: 'Crypto' },
    { value: 'XRP', label: 'Ripple', category: 'alternatives', group: 'Crypto' },
    { value: 'DOGE', label: 'Dogecoin', category: 'alternatives', group: 'Crypto' },
    { value: 'DOT', label: 'Polkadot', category: 'alternatives', group: 'Crypto' },
    { value: 'LTC', label: 'Litecoin', category: 'alternatives', group: 'Crypto' },
    { value: 'LINK', label: 'Chainlink', category: 'alternatives', group: 'Crypto' },
    { value: 'MATIC', label: 'Polygon', category: 'alternatives', group: 'Crypto' },
    { value: 'TRX', label: 'TRON', category: 'alternatives', group: 'Crypto' },
    { value: 'BCH', label: 'Bitcoin Cash', category: 'alternatives', group: 'Crypto' },
    { value: 'NEAR', label: 'Near Protocol', category: 'alternatives', group: 'Crypto' },
    { value: 'ICP', label: 'Internet Computer', category: 'alternatives', group: 'Crypto' },
];

const tickerGroups = availableTickers.reduce((acc, ticker) => {
    if (!acc[ticker.group]) {
        acc[ticker.group] = [];
    }
    acc[ticker.group].push(ticker);
    return acc;
}, {} as Record<string, typeof availableTickers>);


type Allocation = {
  stocks: number;
  bonds: number;
  alternatives: number;
};

type Ticker = {
  id: string;
  name: string;
  category: "stocks" | "bonds" | "alternatives";
};

export function PortfolioBuilder() {
  const router = useRouter();
  const [portfolioName, setPortfolioName] = React.useState("");
  const [allocation, setAllocation] = React.useState<Allocation>({ stocks: 60, bonds: 30, alternatives: 10 });
  const [selectedTickers, setSelectedTickers] = React.useState<Ticker[]>([]);

  const handleTemplateSelect = (template: "conservative" | "balanced" | "aggressive") => {
    setAllocation(templates[template]);
  };
  
  const handleSingleSliderChange = (name: keyof Allocation, value: number) => {
    const currentValue = allocation[name];
    const diff = value - currentValue;

    const otherSliders = Object.keys(allocation).filter(k => k !== name) as (keyof Allocation)[];
    let newAllocation = { ...allocation, [name]: value };

    // Distribute the difference to the other sliders
    let remainingDiff = diff;
    for (let i = 0; i < otherSliders.length; i++) {
        const sliderKey = otherSliders[i];
        if (newAllocation[sliderKey] - remainingDiff >= 0 && newAllocation[sliderKey] - remainingDiff <= 100) {
            newAllocation[sliderKey] -= remainingDiff;
            remainingDiff = 0;
            break;
        }
    }

    if (remainingDiff !== 0) {
      const sliderToAdjust = otherSliders.find(k => newAllocation[k] - remainingDiff >= 0 && newAllocation[k] - remainingDiff <= 100) || otherSliders[0];
       if(sliderToAdjust) {
        newAllocation[sliderToAdjust] -= remainingDiff;
      }
    }
    
    // Ensure total is exactly 100
    const total = Object.values(newAllocation).reduce((sum, v) => sum + v, 0);
    const adjustment = 100 - total;
    if (adjustment !== 0) {
        const keyToAdjust = otherSliders.find(k => newAllocation[k] + adjustment >= 0 && newAllocation[k] + adjustment <= 100) || otherSliders[0];
        if (keyToAdjust) {
          newAllocation[keyToAdjust] += adjustment;
        }
    }

    setAllocation({
      stocks: Math.round(newAllocation.stocks),
      bonds: Math.round(newAllocation.bonds),
      alternatives: Math.round(newAllocation.alternatives),
    });
};


  const handleAddTicker = (tickerValue: string) => {
    const tickerData = availableTickers.find(t => t.value === tickerValue);
    if (tickerData && !selectedTickers.find(t => t.id === tickerData.value)) {
      setSelectedTickers(prev => [
        ...prev,
        { id: tickerData.value, name: tickerData.label, category: tickerData.category as any }
      ]);
    }
  };

  const handleRemoveTicker = (tickerId: string) => {
    setSelectedTickers(prev => prev.filter(t => t.id !== tickerId));
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
           <p className="text-sm text-muted-foreground">Total Allocation: {allocation.stocks + allocation.bonds + allocation.alternatives}%</p>
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
                {Object.entries(tickerGroups).map(([group, tickers]) => (
                    <SelectGroup key={group}>
                        <SelectLabel>{group}</SelectLabel>
                        {tickers.map(t => <SelectItem key={t.value} value={t.value}>{t.label} ({t.value})</SelectItem>)}
                    </SelectGroup>
                ))}
              </SelectContent>
            </Select>
        </CardContent>
      </Card>
      
      <Card className={glassCardClasses}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">5. Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-lg">Stocks</h4>
                        <span className="text-lg font-bold">{allocation.stocks}%</span>
                    </div>
                    <div className="pl-4 space-y-2">
                        {getCategoryTickers("stocks").map(t => (
                            <div key={t.id} className="flex items-center justify-between p-2 rounded-md bg-background/30">
                                <span>{t.name} ({t.id})</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveTicker(t.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-lg">Bonds</h4>
                        <span className="text-lg font-bold">{allocation.bonds}%</span>
                    </div>
                    <div className="pl-4 space-y-2">
                        {getCategoryTickers("bonds").map(t => (
                             <div key={t.id} className="flex items-center justify-between p-2 rounded-md bg-background/30">
                                <span>{t.name} ({t.id})</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveTicker(t.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-lg">Alternatives</h4>
                        <span className="text-lg font-bold">{allocation.alternatives}%</span>
                    </div>
                    <div className="pl-4 space-y-2">
                        {getCategoryTickers("alternatives").map(t => (
                             <div key={t.id} className="flex items-center justify-between p-2 rounded-md bg-background/30">
                                <span>{t.name} ({t.id})</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveTicker(t.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
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
