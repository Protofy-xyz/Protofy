import { useEffect, useRef, useState } from "react";
import { Camera } from '@tamagui/lucide-icons'; // opcional
import { YStack, Paragraph } from '@my/ui';
import { SelectList } from '../SelectList';

export const CameraPreview = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getCameras = async () => {
        try {
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
            setDevices(videoDevices);
            if (videoDevices.length > 0) {
                setSelectedDeviceId(videoDevices[0].deviceId);
            }
        } catch (err) {
            setError("Unable to access cameras: " + (err as Error).message);
        }
    };

    const startCamera = async (deviceId: string) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: deviceId } },
                audio: false,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            setError("Unable to start camera: " + (err as Error).message);
        }
    };

    useEffect(() => {
        getCameras();
    }, []);

    useEffect(() => {
        if (selectedDeviceId) {
            startCamera(selectedDeviceId);
        }
        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [selectedDeviceId]);

    return (
        <YStack space="$4">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: "100%", borderRadius: "12px" }}
            />
            {/* <SelectList
                title="Camera"
                elements={devices.map((d) => ({
                    value: d.deviceId,
                    caption: d.label || `Camera ${d.deviceId.slice(0, 5)}...`,
                }))}
                value={selectedDeviceId}
                setValue={setSelectedDeviceId}
                placeholder="Select a camera"
            /> */}

            {error && (
                <Paragraph color="red" fontWeight="600">
                    {error}
                </Paragraph>
            )}


        </YStack>
    );
};
