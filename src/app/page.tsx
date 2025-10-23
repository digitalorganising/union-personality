"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  questions,
  scaleOptions,
  QuizResponse,
  calculateDimensionScores,
  Question,
} from "@/lib/questions";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuizResponse>({});
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const router = useRouter();

  // Fisher-Yates shuffle algorithm
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  useEffect(() => {
    setIsClient(true);
    if (isClient) {
      setShuffledQuestions(shuffleArray(questions));
    }
  }, [isClient]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const progress =
    shuffledQuestions.length > 0
      ? (currentQuestionIndex / shuffledQuestions.length) * 100
      : 0;
  const isLastQuestion = currentQuestionIndex === shuffledQuestions.length - 1;

  const handleSkip = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Add visual feedback for skip
    setTimeout(() => {
      if (isClient) {
        // Mark question as skipped (no response recorded)
        if (isLastQuestion) {
          // Calculate scores and navigate to results
          const scores = calculateDimensionScores(responses);
          // Store results in sessionStorage for the results page
          sessionStorage.setItem("quizResults", JSON.stringify(scores));
          router.push("/results");
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedValue("");
          setIsTransitioning(false);
        }
      }
    }, 300); // Shorter delay for skip
  };

  const handleBack = () => {
    if (isTransitioning || currentQuestionIndex === 0) return;

    setCurrentQuestionIndex(currentQuestionIndex - 1);
    const previousQuestion = shuffledQuestions[currentQuestionIndex - 1];
    setSelectedValue(
      previousQuestion ? responses[previousQuestion.id]?.toString() || "" : ""
    );
  };

  const handleValueChange = (value: string) => {
    if (isTransitioning) return;

    setSelectedValue(value);
    setIsTransitioning(true);

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (isClient && currentQuestion) {
        const newResponses = {
          ...responses,
          [currentQuestion.id]: parseInt(value),
        };

        if (isLastQuestion) {
          // Calculate scores and navigate to results
          const scores = calculateDimensionScores(newResponses);
          // Store results in sessionStorage for the results page
          sessionStorage.setItem("quizResults", JSON.stringify(scores));
          router.push("/results");
        } else {
          setResponses(newResponses);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedValue("");
          setIsTransitioning(false);
        }
      }
    }, 500); // 500ms delay for better UX
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-2 md:p-4">
      <div className="w-full max-w-2xl mx-auto pt-4 md:pt-8">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            Union Personality Quiz
          </h1>
          <p className="text-sm md:text-base text-slate-600">
            For each statement, choose the option that best describes how much
            you agree.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 md:mb-6 px-2">
          <div className="flex justify-between text-xs md:text-sm text-slate-600 mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4 min-h-[120px] md:min-h-[100px] flex items-center justify-center">
            <CardTitle className="text-lg md:text-xl font-semibold text-slate-800">
              {currentQuestion?.text || "Loading..."}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <RadioGroup
              value={selectedValue}
              onValueChange={handleValueChange}
              className="space-y-0 sm:space-y-2"
            >
              {scaleOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-3 p-2 md:p-3 rounded-lg border-2 transition-all duration-200 ${
                    isTransitioning
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  } ${
                    selectedValue === option.value.toString()
                      ? "border-slate-800 bg-slate-50 shadow-md"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  onClick={() =>
                    !isTransitioning &&
                    handleValueChange(option.value.toString())
                  }
                >
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`option-${option.value}`}
                    className="flex-shrink-0"
                  />
                  <Label
                    htmlFor={`option-${option.value}`}
                    className="flex-1 cursor-pointer text-slate-700 text-sm md:text-base"
                  >
                    <span className="font-medium mr-2 text-base">
                      {option.value}.
                    </span>
                    <span>{option.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentQuestionIndex === 0 || isTransitioning}
                className="px-4 py-2 text-sm"
              >
                Back
              </Button>

              <Button
                variant="outline"
                onClick={handleSkip}
                disabled={isTransitioning}
                className="px-4 py-2 text-sm text-slate-600 border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTransitioning ? "..." : "I'm not sure"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
