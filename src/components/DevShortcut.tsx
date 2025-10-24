"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DevShortcut() {
  const router = useRouter();

  const generateRandomScores = () => {
    // Generate random scores between 12-42 (reasonable range for 8 questions)
    const dimensions = ["Servicing", "Organising", "Campaigning", "Advocating"];

    return dimensions.map((dimension) => ({
      dimension,
      score: Math.floor(Math.random() * 31) + 12, // 12-42 range
      maxScore: 48,
      totalPossibleScore: 48,
      answeredCount: 8,
      totalCount: 8,
    }));
  };

  const handleSkipToResults = () => {
    const sampleResults = generateRandomScores();
    sessionStorage.setItem("quizResults", JSON.stringify(sampleResults));
    router.push("/results");
  };

  return (
    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-xs text-yellow-800 mb-2">Development Mode</p>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSkipToResults}
        className="text-xs"
      >
        Skip to Results (Dev Only)
      </Button>
    </div>
  );
}
