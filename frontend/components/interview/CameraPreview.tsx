"use client";
import { CameraPreviewProps } from "@/types/interview";

export default function CameraPreview({
    stream,
}: CameraPreviewProps) {

    return (
        <div className="w-full overflow-hidden rounded-xl border bg-black">

            {stream ? (
                <video
                    ref={(video) => {
                        if (video) {
                            video.srcObject = stream;
                        }
                    }}
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-64 items-center justify-center text-white">
                    Camera not connected
                </div>
            )}

        </div>
    );
}