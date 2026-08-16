export interface InterviewConfig {
    type: string;
    subject: string;
    language: string;
    difficulty: string;
    questionCount: number;
}

export interface QuestionDisplayProps {
    question: string;
    questionNumber: number;
    totalQuestions: number;
}

export interface AnswerBoxProps {
    answer: string;
    onAnswerChange: (answer: string) => void;
    onSubmit: () => void;
    loading?: boolean;
}

export interface CameraPreviewProps {
    stream: MediaStream | null;
}


export interface ProctoringStatusProps {
    cameraActive: boolean;
    microphoneActive: boolean;
    screenSharing: boolean;
    warningCount: number;
}
