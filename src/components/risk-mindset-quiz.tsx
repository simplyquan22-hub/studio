
"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

const glassCardClasses = "bg-background/50 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/10";

const questions = [
  {
    id: "q1",
    text: "When you think about money, what feels most real to you?",
    options: [
      { id: "a", text: "I need wins NOW.", value: 0 },
      { id: "b", text: "I want progress this year AND next.", value: 1 },
      { id: "c", text: "I’m building for a future version of me.", value: 2 },
    ],
  },
  {
    id: "q2",
    text: "If the stock market dropped 10% next month, how would you react?",
    options: [
      { id: "a", text: "I’d panic + want to sell.", value: 0 },
      { id: "b", text: "I’d be nervous but probably stay in.", value: 1 },
      { id: "c", text: "I’d stay calm and keep investing.", value: 2 },
    ],
  },
  {
    id: "q3",
    text: "How long do you want your investments to work for you?",
    options: [
      { id: "a", text: "Months.", value: 0 },
      { id: "b", text: "Years.", value: 1 },
      { id: "c", text: "Decades.", value: 2 },
    ],
  },
  {
    id: "q4",
    text: "If you invest $200/mo for 20 years, how do you feel?",
    options: [
      { id: "a", text: "That’s too slow.", value: 0 },
      { id: "b", text: "That’s realistic.", value: 1 },
      { id: "c", text: "That’s how wealth is built.", value: 2 },
    ],
  },
  {
    id: "q5",
    text: "Do you believe investing is a game of luck or time?",
    options: [
      { id: "a", text: "Luck.", value: 0 },
      { id: "b", text: "A mix of both.", value: 1 },
      { id: "c", text: "Time.", value: 2 },
    ],
  },
];

const results = {
  "Short-Term Mindset": {
    title: "You think fast money.",
    message: "But fast money creates stress + gambling energy. WealthPath exists to shift you into a LONG GAME. This is where real wealth grows. Ready for the shift?",
    buttonText: "Start Building Your Real Portfolio",
  },
  "Growing Investor Mindset": {
    title: "You have the right instincts.",
    message: "You’re starting to understand the long game. Now let’s anchor your energy into a real plan.",
    buttonText: "Build My WealthPath Portfolio",
  },
  "Long-Term Wealth Builder": {
    title: "You’re playing the only game that wins:",
    message: "Time + discipline + compounding. Let’s map your portfolio.",
    buttonText: "Let’s Build.",
  },
};

type Answers = { [key: string]: string };
const STORAGE_KEY = 'wealthpath-quiz-state';

export function RiskMindsetQuiz() {
  const [answers, setAnswers] = React.useState<Answers>({});
  const [score, setScore] = React.useState<number | null>(null);

  React.useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const { answers: savedAnswers, score: savedScore } = JSON.parse(savedState);
        setAnswers(savedAnswers || {});
        setScore(savedScore !== undefined ? savedScore : null);
      }
    } catch (error) {
      console.error("Failed to parse quiz state from localStorage", error);
      setAnswers({});
      setScore(null);
    }
  }, []);

  React.useEffect(() => {
    try {
      const stateToSave = JSON.stringify({ answers, score });
      localStorage.setItem(STORAGE_KEY, stateToSave);
    } catch (error) {
      console.error("Failed to save quiz state to localStorage", error);
    }
  }, [answers, score]);

  const handleValueChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    for (const question of questions) {
      const answerValue = answers[question.id];
      if (answerValue !== undefined) {
        totalScore += parseInt(answerValue, 10);
      }
    }
    setScore(totalScore);
  };

  const getResultProfile = () => {
    if (score === null) return null;
    if (score <= 3) return "Short-Term Mindset";
    if (score >= 4 && score <= 7) return "Growing Investor Mindset";
    return "Long-Term Wealth Builder";
  };

  const resultProfile = getResultProfile();
  const resultData = resultProfile ? results[resultProfile as keyof typeof results] : null;

  const allQuestionsAnswered = Object.keys(answers).length === questions.length;

  return (
    <Card className={`max-w-3xl mx-auto ${glassCardClasses}`}>
      <CardContent className="p-6 md:p-8">
        {score === null ? (
          <div className="space-y-8">
            {questions.map((q) => (
              <div key={q.id}>
                <h3 className="font-semibold text-lg mb-4">{q.text}</h3>
                <RadioGroup value={answers[q.id]} onValueChange={(value) => handleValueChange(q.id, value)}>
                  <div className="space-y-3">
                    {q.options.map((opt) => (
                      <div key={opt.id} className="flex items-center space-x-3">
                        <RadioGroupItem value={String(opt.value)} id={`${q.id}-${opt.id}`} />
                        <Label htmlFor={`${q.id}-${opt.id}`} className="text-base font-normal cursor-pointer">
                          {opt.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ))}
            <Button
              onClick={calculateScore}
              disabled={!allQuestionsAnswered}
              className="w-full h-12 text-lg mt-8"
            >
              See My Result
            </Button>
          </div>
        ) : (
          resultData && (
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold font-headline mb-2">{resultData.title}</h2>
              <p className="text-muted-foreground text-lg mb-8">{resultData.message}</p>
              <Link href="/portfolio-builder" passHref legacyBehavior>
                <a className="inline-block">
                    <Button
                    className="h-12 text-lg px-8"
                    >
                    {resultData.buttonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </a>
              </Link>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
