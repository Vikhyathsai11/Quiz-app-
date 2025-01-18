"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers?: string[];
  userAnswer?: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=15");
        const data = await response.json();
        
        const processedQuestions = data.results.map((q: Question) => ({
          ...q,
          all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
          question: decodeHTMLEntities(q.question)
        }));
        
        setQuestions(processedQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("userEmail")) {
      router.push("/");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const decodeHTMLEntities = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  };

  const handleAnswer = (answer: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].userAnswer = answer;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    const results = questions.map(q => ({
      question: q.question,
      userAnswer: q.userAnswer || "Not answered",
      correctAnswer: q.correct_answer,
      isCorrect: q.userAnswer === q.correct_answer
    }));
    
    localStorage.setItem("quizResults", JSON.stringify(results));
    router.push("/results");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Timer and Progress */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center text-gray-700">
            <Clock className="w-5 h-5 mr-2" />
            <span className="font-semibold">{formatTime(timeLeft)}</span>
          </div>
          <div className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">{questions[currentQuestion].question}</h2>
          
          <div className="space-y-3">
            {questions[currentQuestion].all_answers?.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(answer)}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  questions[currentQuestion].userAnswer === answer
                    ? "bg-indigo-100 border-indigo-500"
                    : "bg-gray-50 hover:bg-gray-100"
                } border`}
              >
                {decodeHTMLEntities(answer)}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center px-4 py-2 bg-white rounded-lg shadow-md disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow-md"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          )}
        </div>

        {/* Question Overview */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === currentQuestion
                    ? "bg-indigo-600 text-white"
                    : questions[index].userAnswer
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}