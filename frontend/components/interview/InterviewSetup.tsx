"use client";

import { useState } from "react";
import { InterviewConfig } from "@/types/interview";

interface InterviewSetupProps {
    onStart: (config: InterviewConfig) => void;
}

export default function InterviewSetup({ onStart,}: InterviewSetupProps) {

    const [type, setType] = useState("Technical");
    const [subject, setSubject] = useState("Java");
    const [language, setLanguage] = useState("Java");
    const [difficulty, setDifficulty] = useState("Medium");
    const [questionCount, setQuestionCount] = useState(10);

    const handleStart = () => {
        const config: InterviewConfig = {
            type,
            subject,
            language,
            difficulty,
            questionCount,
        };
        onStart(config);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">
                Interview Setup
            </h1>
            <div className="space-y-5">
                {/* Interview Type */}
                <div>
                    <label className="block mb-2 font-medium">
                        Interview Type
                    </label>
                    <select
                        value={type}
                        onChange={(e) =>
                            setType(e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                    >
                        <option value="Technical">
                            Technical
                        </option>
                        <option value="HR">
                            HR
                        </option>

                        <option value="Behavioral">
                            Behavioral
                        </option>

                        <option value="Mixed">
                            Mixed
                        </option>
                    </select>
                </div>


                {/* Subject */}

                <div>
                    <label className="block mb-2 font-medium">
                        Subject / Topic
                    </label>

                    <select
                        value={subject}
                        onChange={(e) =>
                            setSubject(e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                    >
                        <option value="Java">
                            Java
                        </option>

                        <option value="Python">
                            Python
                        </option>

                        <option value="Spring Boot">
                            Spring Boot
                        </option>

                        <option value="DSA">
                            Data Structures & Algorithms
                        </option>

                        <option value="DBMS">
                            DBMS
                        </option>

                        <option value="React">
                            React
                        </option>

                        <option value="JavaScript">
                            JavaScript
                        </option>

                        <option value="Custom">
                            Custom Topic
                        </option>
                    </select>
                </div>


                {/* Programming Language */}

                <div>
                    <label className="block mb-2 font-medium">
                        Programming Language
                    </label>

                    <select
                        value={language}
                        onChange={(e) =>
                            setLanguage(e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                    >
                        <option value="Java">
                            Java
                        </option>

                        <option value="Python">
                            Python
                        </option>

                        <option value="C++">
                            C++
                        </option>

                        <option value="JavaScript">
                            JavaScript
                        </option>

                        <option value="TypeScript">
                            TypeScript
                        </option>

                        <option value="C">
                            C
                        </option>
                    </select>
                </div>


                {/* Difficulty */}

                <div>
                    <label className="block mb-2 font-medium">
                        Difficulty
                    </label>

                    <select
                        value={difficulty}
                        onChange={(e) =>
                            setDifficulty(e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                    >
                        <option value="Easy">
                            Easy
                        </option>

                        <option value="Medium">
                            Medium
                        </option>

                        <option value="Hard">
                            Hard
                        </option>
                    </select>
                </div>


                {/* Number of Questions */}

                <div>
                    <label className="block mb-2 font-medium">
                        Number of Questions
                    </label>

                    <select
                        value={questionCount}
                        onChange={(e) =>
                            setQuestionCount(
                                Number(e.target.value)
                            )
                        }
                        className="w-full border rounded-lg p-3"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                </div>


                {/* Start */}

                <button
                    onClick={handleStart}
                    className="w-full bg-black text-white rounded-lg p-3 font-medium hover:opacity-90"
                >
                    Start Interview
                </button>

            </div>
        </div>
    );
}