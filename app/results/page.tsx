"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface QuizResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export default function ResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedResults = localStorage.getItem("quizResults");
    const storedEmail = localStorage.getItem("userEmail");

    if (!storedResults || !storedEmail) {
      router.push("/");
      return;
    }

    setResults(JSON.parse(storedResults));
    setEmail(storedEmail);
  }, []);

  const score = results.filter(r => r.isCorrect).length;
  const percentage = (score / results.length) * 100;

  const handleRestart = () => {
    localStorage.removeItem("quizResults");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Score Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
            <p className="text-gray-600 mb-4">{email}</p>
            <div className="text-5xl font-bold text-indigo-600 mb-2">
              {percentage.toFixed(1)}%
            </div>
            <p className="text-gray-600">
              You got {score} out of {results.length} questions correct
            </p>
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-6">
          {results.map((result, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {result.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Question {index + 1}: {result.question}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-gray-600">Your answer: </span>
                      <span className={result.isCorrect ? "text-green-600" : "text-red-600"}>
                        {result.userAnswer}
                      </span>
                    </p>
                    {!result.isCorrect && (
                      <p className="text-sm">
                        <span className="text-gray-600">Correct answer: </span>
                        <span className="text-green-600">{result.correctAnswer}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Restart Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleRestart}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Take Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
}