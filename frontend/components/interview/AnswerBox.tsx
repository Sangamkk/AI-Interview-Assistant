"use client";
import { AnswerBoxProps } from "@/types/interview";

export default function AnswerBox({
    answer,
    onAnswerChange,
    onSubmit,
    loading = false,
}: AnswerBoxProps) {

    return (
        <div className="w-full rounded-xl border bg-white p-6 shadow-sm">

            <label className="mb-3 block text-sm font-medium text-gray-700">
                Your Answer
            </label>

            <textarea
                value={answer}
                onChange={(e) =>
                    onAnswerChange(e.target.value)
                }
                placeholder="Type your answer here..."
                rows={7}
                disabled={loading}
                className="w-full resize-none rounded-lg border p-4 outline-none focus:ring-2"
            />

            <div className="mt-4 flex justify-end">

                <button
                    onClick={onSubmit}
                    disabled={
                        loading ||
                        answer.trim().length === 0
                    }
                    className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Evaluating..."
                        : "Submit Answer"}
                </button>

            </div>

        </div>
    );
}