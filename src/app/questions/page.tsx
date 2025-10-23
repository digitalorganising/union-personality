"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { questions, dimensions, reverseKeyed } from "@/lib/questions";
import Head from "next/head";

export default function QuestionsPage() {
  // Create a map of question ID to dimension for easy lookup
  const questionToDimension = dimensions.reduce((acc, dimension) => {
    dimension.questionIds.forEach((questionId) => {
      acc[questionId] = dimension.name;
    });
    return acc;
  }, {} as Record<number, string>);

  return (
    <>
      <Head>
        <meta
          name="robots"
          content="noindex, nofollow, noarchive, nosnippet, noimageindex"
        />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta name="bingbot" content="noindex, nofollow" />
        <title>Internal Questions Review - Not Public</title>
      </Head>
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">
              Union Personality Quiz - Questions Review
            </h1>
            <p className="text-slate-600">
              Complete list of questions with their dimensions and scoring
              information
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {questions.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Dimensions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {dimensions.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Reverse-Keyed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {reverseKeyed.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Questions by Dimension */}
          <div className="space-y-6">
            {dimensions.map((dimension) => {
              const dimensionQuestions = questions.filter((q) =>
                dimension.questionIds.includes(q.id)
              );

              return (
                <Card key={dimension.name}>
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-800">
                      {dimension.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-2 font-medium text-slate-600">
                              ID
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-slate-600">
                              Reverse-Keyed
                            </th>
                            <th className="text-left py-3 px-2 font-medium text-slate-600">
                              Question
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dimensionQuestions.map((question) => {
                            const isReverseKeyed = reverseKeyed.includes(
                              question.id
                            );

                            return (
                              <tr
                                key={question.id}
                                className="border-b border-slate-100 hover:bg-slate-50"
                              >
                                <td className="py-3 px-2 font-medium text-slate-600">
                                  {question.id}
                                </td>
                                <td className="py-3 px-2">
                                  <span className="text-slate-600 text-xs">
                                    {isReverseKeyed ? "Yes" : "No"}
                                  </span>
                                </td>
                                <td className="py-3 px-2 text-slate-700">
                                  {question.text}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Dimensions Breakdown */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">
                Dimensions Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dimensions.map((dimension) => {
                  const dimensionQuestions = questions.filter((q) =>
                    dimension.questionIds.includes(q.id)
                  );
                  const reverseKeyedInDimension = dimensionQuestions.filter(
                    (q) => reverseKeyed.includes(q.id)
                  );

                  return (
                    <div
                      key={dimension.name}
                      className="border-l-4 border-slate-200 pl-4"
                    >
                      <h3 className="font-semibold text-slate-800 mb-2">
                        {dimension.name}
                      </h3>
                      <div className="text-sm text-slate-600 mb-2">
                        {dimensionQuestions.length} questions
                        {reverseKeyedInDimension.length > 0 && (
                          <span className="ml-2">
                            ({reverseKeyedInDimension.length} reverse-keyed)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        Questions: {dimension.questionIds.join(", ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
