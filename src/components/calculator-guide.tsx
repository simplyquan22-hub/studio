
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Percent, Calendar, Info } from "lucide-react";

const glassCardClasses = "bg-background/50 backdrop-blur-xl border-t border-l border-r border-b border-white/10 shadow-xl shadow-black/10 bg-gradient-to-br from-white/5 via-transparent to-transparent";

export function CalculatorGuide() {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className={glassCardClasses}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <Info className="h-6 w-6" /> How to Use This Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            This tool is designed to give you a clear projection of your potential investment growth based on a few key inputs.
          </p>
          <ul className="space-y-3">
            <li>
              <strong>Initial Investment:</strong> The amount of money you are starting with.
            </li>
            <li>
              <strong>Monthly Contribution:</strong> The amount you plan to add to your investment each month.
            </li>
            <li>
              <strong>Interest Rate (%):</strong> Your estimated annual return on investment. A common benchmark is the average historical return of the S&amp;P 500, which is around 7-10%.
            </li>
             <li>
              <strong>Marginal Tax Rate (%):</strong> Your estimated combined federal and state income tax rate. This is used to calculate the after-tax value of a Traditional IRA.
            </li>
            <li>
              <strong>Years:</strong> The number of years you plan to let your investment grow.
            </li>
            <li>
              <strong>Account Type:</strong> The type of retirement account you are using. This choice has significant tax implications.
            </li>
            <li>
              <strong>Adjust for Inflation:</strong> When enabled, this projects the future value of your investment in today's dollars, giving you a clearer sense of its future purchasing power.
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card className={glassCardClasses}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <DollarSign className="h-6 w-6" /> Account Types Explained
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg text-primary">Roth IRA</h4>
            <p className="text-muted-foreground">
              Contributions are made with <span className="text-foreground font-medium">after-tax</span> dollars. This means you pay taxes on the money before you invest it. The key benefit is that your qualified withdrawals in retirement are <span className="text-green-400 font-medium">100% tax-free</span>.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg text-primary">Traditional IRA</h4>
            <p className="text-muted-foreground">
              Contributions are typically made with <span className="text-foreground font-medium">pre-tax</span> dollars, which may lower your taxable income for the year. However, you will pay income tax on all withdrawals in retirement. This calculator estimates the after-tax value based on your provided marginal rate.
            </p>
          </div>
          <p className="text-xs text-muted-foreground pt-4">
            Disclaimer: This calculator is for illustrative purposes only and does not constitute financial advice. Consult with a financial professional for personalized advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
