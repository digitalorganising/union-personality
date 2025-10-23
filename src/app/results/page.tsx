"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DimensionScore } from "@/lib/questions";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const [results, setResults] = useState<DimensionScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const storedResults = sessionStorage.getItem("quizResults");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
    setLoading(false);
  }, []);

  const handleRestart = () => {
    if (isClient) {
      sessionStorage.removeItem("quizResults");
      router.push("/");
    }
  };

  if (loading || !isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Calculating your results...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-slate-800">
              No Results Found
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-4">
              It looks like you haven't completed the quiz yet.
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              Take the Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Your Union Personality Results
          </h1>
          <p className="text-lg text-slate-600">
            Here are your scores across the four dimensions of union
            personality:
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {results.map((result, index) => {
            const percentage =
              result.maxScore > 0
                ? Math.round((result.score / result.maxScore) * 100)
                : 0;
            const colors = [
              "from-blue-500 to-blue-600",
              "from-green-500 to-green-600",
              "from-purple-500 to-purple-600",
              "from-orange-500 to-orange-600",
            ];
            return (
              <Card
                key={result.dimension}
                className="shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-slate-800 flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors[index]} mr-3`}
                    ></div>
                    {result.dimension}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Score</span>
                      <span className="font-medium">
                        {result.score} / {result.maxScore}
                      </span>
                    </div>
                    {result.answeredCount < result.totalCount && (
                      <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                        Based on {result.answeredCount} of {result.totalCount}{" "}
                        questions
                      </div>
                    )}
                    <Progress value={percentage} className="h-3" />
                    <div className="text-center">
                      <span className="text-3xl font-bold text-slate-800">
                        {percentage}%
                      </span>
                      <p className="text-sm text-slate-500 mt-1">
                        {percentage >= 80
                          ? "Very High"
                          : percentage >= 60
                          ? "High"
                          : percentage >= 40
                          ? "Moderate"
                          : percentage >= 20
                          ? "Low"
                          : "Very Low"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="text-center space-x-4">
          <Button
            onClick={handleRestart}
            variant="outline"
            size="lg"
            className="px-8"
          >
            Take Quiz Again
          </Button>
        </div>
      </div>
    </div>
  );
}
