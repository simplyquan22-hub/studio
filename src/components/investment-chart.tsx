"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
import type { InvestmentData } from "@/components/wealth-calculator";
import { Card } from "./ui/card";

interface InvestmentChartProps {
  data: InvestmentData[];
  selectedYear: number;
  adjustForInflation: boolean;
}

const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1e3) {
    return `$${(value / 1e3).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const CustomTooltip = ({ active, payload, label, adjustForInflation }: any) => {
  if (active && payload && payload.length) {
    const yearData = payload[0].payload as InvestmentData;
    let projectedValue = yearData.projectedValue;
    let totalInvestment = yearData.totalInvestment;

    if (adjustForInflation) {
        const inflationDivisor = Math.pow(1 + (0.03), yearData.year); // Assuming 3% for tooltip, should be passed in ideally
        projectedValue = yearData.inflationAdjustedValue;
        totalInvestment /= inflationDivisor;
    }
    
    return (
      <Card className="p-4 bg-background/80 backdrop-blur-sm border-white/10">
        <p className="label font-bold">{`Year ${label}`}</p>
        <p className="intro text-primary">{`Projected Value: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(projectedValue)}`}</p>
        <p className="intro text-muted-foreground">{`Total Investment: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalInvestment)}`}</p>
      </Card>
    );
  }
  return null;
};


export function InvestmentChart({ data, selectedYear, adjustForInflation }: InvestmentChartProps) {
  const chartData = data.map(d => {
    let projectedValue = d.projectedValue;
    let totalInvestment = d.totalInvestment;

    if (adjustForInflation) {
        const inflationDivisor = Math.pow(1 + (0.03), d.year); // Should be passed from form
        projectedValue = d.inflationAdjustedValue;
        totalInvestment /= inflationDivisor;
    }

    return {
        ...d,
        displayProjectedValue: projectedValue,
        displayTotalInvestment: totalInvestment,
        displayReturns: Math.max(0, projectedValue - totalInvestment),
    };
  });
  
  const selectedYearData = chartData.find(d => d.year === selectedYear);


  return (
    <div className="h-80 w-full mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
             <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis 
            dataKey="year" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            domain={['dataMin', 'dataMax']}
          />
          <Tooltip content={<CustomTooltip adjustForInflation={adjustForInflation} />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}/>
          <Area
            type="monotone"
            dataKey="displayProjectedValue"
            name="Projected Value"
            stackId="1"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#colorReturns)"
          />
           <Area
            type="monotone"
            dataKey="displayTotalInvestment"
            name="Total Investment"
            stackId="1"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            fill="url(#colorInvestment)"
          />
           {selectedYearData && (
                <ReferenceDot
                    x={selectedYearData.year}
                    y={selectedYearData.displayProjectedValue}
                    r={8}
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                />
            )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

    