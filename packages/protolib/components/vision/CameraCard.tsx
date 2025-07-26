import { useEffect, useMemo, useRef, useState } from "react";
import { Button, YStack, Paragraph } from '@my/ui';
import { Camera } from '@tamagui/lucide-icons';

export const CameraCard = ({ params, onPicture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

    const fps = params?.fps?.defaultValue || 1;

    useEffect(() => {
        if(params?.mode?.defaultValue != 'auto') {
            console.log("Camera mode is not set to auto, skipping interval setup.");
            return;
        }
        console.log("Setting up interval for capturing images at", fps, "fps");
        clearInterval(intervalRef.current as NodeJS.Timeout);
        intervalRef.current = setInterval(() => {
            captureImage();
        }, 1000 / fps);

        return () => clearInterval(intervalRef.current as NodeJS.Timeout);
    }, [fps]);

    return useMemo(() => (
        <YStack ai="center" space="$4" height="100%">

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: "99%" }}
            />

            {/* {params?.mode?.defaultValue == 'auto' && (
                <Paragraph position="relative" top={-15} fontSize="$1" width="100%" mr="$4" textAlign="right">
                    Capturing at {fps} fps
                </Paragraph>
            )} */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {params?.mode?.defaultValue == 'manual' && <Button
                position="absolute"
                icon={Camera}
                onPress={captureImage}
                theme="active"
                size="$4"
                bottom={20}
                className="no-drag"
            >
                Take picture
            </Button>}

            {error && (
                <Paragraph color="red" fontWeight="600">
                    {error}
                </Paragraph>
            )}
        </YStack>
    ) , [params?.mode?.defaultValue, fps, error]);
};
