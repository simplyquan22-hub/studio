
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Landmark,
  Repeat,
  Percent,
  CalendarClock,
  Briefcase,
  TrendingUp,
  PiggyBank,
  ArrowRight,
  Scale,
  ArrowLeft,
  Info,
  HeartCrack,
  Smile,
  ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconInput } from "@/components/icon-input";
import { InvestmentChart } from "@/components/investment-chart";
import { AnnualBreakdown } from "@/components/annual-breakdown";
import { Switch } from "@/components/ui/switch";
import { Label } from "./ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const formSchema = z.object({
  initialInvestment: z.coerce.number({invalid_type_error: "Please enter a number."}).min(0, "Value must be positive."),
  monthlyContribution: z.coerce.number({invalid_type_error: "Please enter a number."}).min(0, "Value must be positive."),
  interestRate: z.coerce.number({invalid_type_error: "Please enter a number."}).min(0, "Rate must be positive.").max(100, "Rate cannot exceed 100."),
  marginalTaxRate: z.coerce.number({invalid_type_error: "Please enter a number."}).min(0, "Rate must be positive.").max(100, "Rate cannot exceed 100."),
  years: z.coerce.number({invalid_type_error: "Please enter a number."}).int().min(1, "Must be at least 1 year.").max(100, "Cannot exceed 100 years."),
  accountType: z.enum(["roth", "traditional"]),
  adjustForInflation: z.boolean().default(false),
  inflationRate: z.coerce.number({invalid_type_error: "Please enter a number."}).min(0).max(20).default(3),
});

type FormData = z.infer<typeof formSchema>;

export interface InvestmentData {
  year: number;
  totalInvestment: number;
  projectedValue: number;
  totalReturns: number;
  annualContributions: number;
  annualReturns: number;
}

const glassCardClasses = "bg-background/50 backdrop-blur-xl border-t border-l border-r border-b border-white/10 shadow-xl shadow-black/10 bg-gradient-to-br from-white/5 via-transparent to-transparent";
const STORAGE_KEY = 'wealthpath-calculator-state';

export function WealthCalculator() {
  const [data, setData] = React.useState<InvestmentData[] | null>(null);
  const [submittedValues, setSubmittedValues] = React.useState<FormData | null>(null);
  const [isCrashSimulated, setIsCrashSimulated] = React.useState(false);
  const [showCrashPopup, setShowCrashPopup] = React.useState(false);

  const router = useRouter();


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialInvestment: 10000,
      monthlyContribution: 500,
      interestRate: 7,
      marginalTaxRate: 25,
      years: 30,
      accountType: "roth",
      adjustForInflation: false,
      inflationRate: 3,
    },
  });

  React.useEffect(() => {
    try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            const savedValues = JSON.parse(savedState);
            form.reset(savedValues);
        }
    } catch (error) {
        console.error("Failed to parse calculator state from localStorage", error);
    }
  }, [form]);

  const formValues = form.watch();
  const adjustForInflation = form.watch("adjustForInflation");

  React.useEffect(() => {
    const handleSave = () => {
      try {
        if(form.formState.isDirty){
          const stateToSave = JSON.stringify(formValues);
          localStorage.setItem(STORAGE_KEY, stateToSave);
        }
      } catch (error) {
        console.error("Failed to save calculator state to localStorage", error);
      }
    };
    
    const debounceSave = setTimeout(handleSave, 500);
    return () => clearTimeout(debounceSave);
  }, [formValues, form.formState.isDirty]);

  async function onSubmit(values: FormData) {
    const generatedData = await generateInvestmentData(values);
    setData(generatedData);
    setSubmittedValues(values);
    setIsCrashSimulated(false);
  }

  const generateInvestmentData = async (inputs: FormData): Promise<InvestmentData[]> => {
    const {
      initialInvestment,
      monthlyContribution,
      interestRate,
      years,
      accountType,
      marginalTaxRate,
      adjustForInflation,
      inflationRate,
    } = inputs;

    const results: InvestmentData[] = [];
    const monthlyInterestRate = interestRate / 100 / 12;
    const numMonths = years * 12;

    let currentValue = initialInvestment;
    let totalPrincipal = initialInvestment;
    
    let lastYearValue = initialInvestment;
    if (accountType === 'traditional') {
      lastYearValue *= (1 - marginalTaxRate / 100);
    }
    if (adjustForInflation) {
      lastYearValue /= Math.pow(1 + (inflationRate / 100), 0);
    }


    // Year 0 data point
    results.push({
      year: 0,
      projectedValue: initialInvestment,
      totalInvestment: initialInvestment,
      totalReturns: 0,
      annualContributions: initialInvestment,
      annualReturns: 0,
    });

    for (let year = 1; year <= years; year++) {
        let yearlyContribution = 0;
        let beginningOfYearValue = currentValue;

        for (let month = 1; month <= 12; month++) {
            currentValue += monthlyContribution;
            currentValue *= (1 + monthlyInterestRate);
            yearlyContribution += monthlyContribution;
        }
        
        totalPrincipal += yearlyContribution;

        let endOfYearValue = currentValue;

        if (accountType === 'traditional') {
            endOfYearValue *= (1 - marginalTaxRate / 100);
        }

        if (adjustForInflation) {
            endOfYearValue /= Math.pow(1 + (inflationRate / 100), year);
        }

        const annualReturns = endOfYearValue - lastYearValue - (accountType === 'roth' ? yearlyContribution * (1-marginalTaxRate/100) : yearlyContribution);
        
        results.push({
            year,
            projectedValue: endOfYearValue,
            totalInvestment: totalPrincipal,
            totalReturns: endOfYearValue - totalPrincipal,
            annualContributions: yearlyContribution,
            annualReturns: isNaN(annualReturns) ? 0 : annualReturns,
        });

        lastYearValue = endOfYearValue;
    }

    return results;
  };

  const handleSimulateCrash = () => {
    setIsCrashSimulated(true);
    setShowCrashPopup(true);
  };

  const handleRevertCrash = () => {
    setIsCrashSimulated(false);
  };

  const finalData = data ? data[data.length - 1] : null;
  let finalProjectedValue = finalData?.projectedValue ?? 0;
  let finalTotalReturns = finalData?.totalReturns ?? 0;

  if (isCrashSimulated) {
      finalProjectedValue *= 0.8;
      const totalInvestment = finalData?.totalInvestment ?? 0;
      finalTotalReturns = finalProjectedValue - totalInvestment;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const getAccountTypeName = (type: string | undefined) => {
    if (!type) return "";
    switch (type) {
      case "roth":
        return "Roth IRA";
      case "traditional":
        return "Traditional IRA";
      default:
        return "";
    }
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className={`lg:col-span-1 ${glassCardClasses}`}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Investment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="initialInvestment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Investment</FormLabel>
                      <FormControl>
                        <IconInput icon={<Landmark />} type="number" placeholder="10,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlyContribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Contribution</FormLabel>
                      <FormControl>
                        <IconInput icon={<Repeat />} type="number" placeholder="500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest Rate (%)</FormLabel>
                        <FormControl>
                          <IconInput icon={<Percent />} type="number" placeholder="7" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="years"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years</FormLabel>
                        <FormControl>
                          <IconInput icon={<CalendarClock />} type="number" placeholder="30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                    control={form.control}
                    name="marginalTaxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marginal Tax Rate (%)</FormLabel>
                        <FormControl>
                          <IconInput icon={<Scale />} type="number" placeholder="25" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                  control={form.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-base md:text-sm">
                            <Briefcase className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Select an account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="roth">Roth IRA</SelectItem>
                          <SelectItem value="traditional">Traditional IRA</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Card className="bg-background/30 border-white/10 p-4 space-y-4">
                  <FormField
                      control={form.control}
                      name="adjustForInflation"
                      render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                              <Label htmlFor="inflation-switch" className="flex flex-col space-y-1">
                                  <span>Adjust for Inflation</span>
                                  <span className="font-normal text-xs text-muted-foreground">
                                      Project values in today's dollars.
                                  </span>
                              </Label>
                              <FormControl>
                                  <Switch
                                      id="inflation-switch"
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                  />
                              </FormControl>
                          </FormItem>
                      )}
                      />
                  {adjustForInflation && (
                      <FormField
                          control={form.control}
                          name="inflationRate"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Assumed Inflation (%)</FormLabel>
                                  <FormControl>
                                      <IconInput icon={<Percent />} type="number" placeholder="3" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                  )}
                </Card>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Button onClick={() => router.back()} variant="outline" size="lg" type="button" className="w-full sm:w-auto">
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Back
                  </Button>
                  <Button type="submit" className="w-full h-12 text-lg">
                      Calculate
                      <ArrowRight className="ml-2 h-5 w-5"/>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
        {data && finalData && submittedValues ? (
          <Card className={glassCardClasses}>
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex justify-between items-center">
                <span>
                  {`Projected Growth for ${getAccountTypeName(submittedValues?.accountType)}`}
                  {submittedValues.adjustForInflation && <span className="text-base font-normal text-muted-foreground ml-2">(Adjusted for Inflation)</span>}
                </span>
                {!isCrashSimulated ? (
                  <Button variant="destructive" size="sm" onClick={handleSimulateCrash}>
                    <ShieldAlert className="mr-2 h-4 w-4" /> Simulate -20% Drop
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={handleRevertCrash}>
                    <Smile className="mr-2 h-4 w-4" /> Revert Simulation
                  </Button>
                )}
              </CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="rounded-lg p-4 bg-background/40 cursor-pointer">
                        <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                          {isCrashSimulated ? <HeartCrack className="h-4 w-4 text-destructive" /> : <TrendingUp className="h-4 w-4"/>}
                          <span>Future Value</span>
                          <Info className="h-4 w-4" />
                        </div>
                        <p className={`text-2xl font-bold ${isCrashSimulated ? 'text-destructive' : 'text-primary'}`}>{formatCurrency(finalProjectedValue)}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>All returns are estimates — actual results will vary. This calculator is for educational purposes only.</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="rounded-lg p-4 bg-background/40">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><PiggyBank className="h-4 w-4"/> Total Invested</p>
                    <p className="text-2xl font-bold">{formatCurrency(finalData.totalInvestment)}</p>
                  </div>
                  <div className="rounded-lg p-4 bg-background/40">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <TrendingUp className={`h-4 w-4 ${finalTotalReturns >= 0 ? 'text-green-400' : 'text-destructive'}`}/> Total Returns
                    </p>
                    <p className={`text-2xl font-bold ${finalTotalReturns >= 0 ? 'text-green-400' : 'text-destructive'}`}>{formatCurrency(finalTotalReturns)}</p>
                  </div>
                </div>
            </CardHeader>
            <CardContent>
              <InvestmentChart data={data} />
              <AnnualBreakdown data={data.filter(d => d.year > 0)} />
            </CardContent>
          </Card>
        ) : (
          <Card className={`flex flex-col items-center justify-center text-center p-8 lg:p-16 min-h-[300px] lg:min-h-[600px] ${glassCardClasses}`}>
              <div className="p-4 bg-primary/20 rounded-full mb-4">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-headline">Your financial projection awaits.</h3>
              <p className="text-muted-foreground mt-2">Fill out the form to visualize your investment journey.</p>
            </Card>
        )}
        </div>
      </div>
      <AlertDialog open={showCrashPopup} onOpenChange={setShowCrashPopup}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>The market just dropped 20%...</AlertDialogTitle>
            <AlertDialogDescription>
              Your new projected value is <span className="font-bold text-destructive">{formatCurrency(finalProjectedValue)}</span>.
              This is a simulation. How would you react in this real-life scenario?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2">
            <Button variant="outline" onClick={() => setShowCrashPopup(false)}>😱 “Sell everything!”</Button>
            <Button variant="outline" onClick={() => setShowCrashPopup(false)}>😬 “Reduce risk…”</Button>
            <Button variant="outline" onClick={() => setShowCrashPopup(false)}>😐 “Stay calm & hold.”</Button>
            <AlertDialogAction onClick={() => setShowCrashPopup(false)}>🧘 “Buy more while it’s cheap!”</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
