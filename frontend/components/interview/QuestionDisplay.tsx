"use client";
import { QuestionDisplayProps } from "@/types/interview";

export default function QuestionDisplay({
    question,
    questionNumber,
    totalQuestions,
}: QuestionDisplayProps) {

    return (
        <div className="w-full rounded-xl border bg-white p-6 shadow-sm">

            {/* Progress */}

            <div className="mb-4 flex items-center justify-between">

                <span className="text-sm font-medium text-gray-500">
                    Question {questionNumber} of {totalQuestions}
                </span>

                <span className="text-sm text-gray-500">
                    {Math.round(
                        (questionNumber / totalQuestions) * 100
                    )}%
                </span>

            </div>


            {/* Progress bar */}

            <div className="mb-6 h-2 w-full rounded-full bg-gray-200">

                <div
                    className="h-2 rounded-full bg-black transition-all"
                    style={{
                        width: `${
                            (questionNumber / totalQuestions) * 100
                        }%`,
                    }}
                />

            </div>


            {/* Question */}

            <div>

                <p className="mb-2 text-sm font-medium text-gray-500">
                    Interview Question
                </p>

                <h2 className="text-xl font-semibold text-gray-900">
                    {question}
                </h2>

            </div>

        </div>
    );
}