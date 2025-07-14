import { useEffect, useRef, useState } from "react";
import { Button, YStack, Paragraph } from '@my/ui';
import { Camera } from '@tamagui/lucide-icons';

export const CameraCard = ({ onPicture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState<string | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            setError("Unable to access camera: " + (err as Error).message);
        }
    };

    const captureImage = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        const width = video.videoWidth;
        const height = video.videoHeight;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(video, 0, 0, width, height);
            const base64Image = canvas.toDataURL("image/png");
            onPicture(base64Image);
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <YStack space="$4">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: "100%", borderRadius: 12 }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />

            <Button
                icon={Camera}
                onPress={captureImage}
                theme="active"
                size="$4"
            >
                Take picture
            </Button>

            {error && (
                <Paragraph color="red" fontWeight="600">
                    {error}
                </Paragraph>
            )}
        </YStack>
    );
};
