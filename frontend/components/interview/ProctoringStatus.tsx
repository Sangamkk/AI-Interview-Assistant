"use client";
import { ProctoringStatusProps } from "@/types/interview";

export default function ProctoringStatus({
    cameraActive,
    microphoneActive,
    screenSharing,
    warningCount,
}: ProctoringStatusProps) {

    return (
        <div className="w-full rounded-xl border bg-white p-4 shadow-sm">

            <h3 className="mb-4 font-semibold">
                Interview Monitoring
            </h3>

            <div className="grid grid-cols-2 gap-3">

                {/* Camera */}

                <div className="flex items-center gap-2">
                    <span>
                        {cameraActive ? "🟢" : "🔴"}
                    </span>

                    <span className="text-sm">
                        Camera
                    </span>
                </div>


                {/* Microphone */}

                <div className="flex items-center gap-2">
                    <span>
                        {microphoneActive ? "🟢" : "🔴"}
                    </span>

                    <span className="text-sm">
                        Microphone
                    </span>
                </div>


                {/* Screen Sharing */}

                <div className="flex items-center gap-2">
                    <span>
                        {screenSharing ? "🟢" : "🔴"}
                    </span>

                    <span className="text-sm">
                        Screen Sharing
                    </span>
                </div>


                {/* Warnings */}

                <div className="flex items-center gap-2">
                    <span>
                        {warningCount > 0 ? "⚠️" : "🟢"}
                    </span>

                    <span className="text-sm">
                        Warnings: {warningCount}
                    </span>
                </div>

            </div>

        </div>
    );
}