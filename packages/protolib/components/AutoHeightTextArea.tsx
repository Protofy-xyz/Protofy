import React, { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { TextArea } from '@my/ui'
import { XStack, YStack, Button, Spinner } from '@my/ui'
import { Trash, Plus, Mic } from '@tamagui/lucide-icons'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const minHeight = 50;
const maxHeight = 300;

export const AutoHeightTextArea = ({
    value,
    speechRecognition,
    onChange,
    onKeyDown,
    readOnly,
    placeholder,
    style,
    ...rest
}) => {
    const ref = useRef(null);
    const [speechRecognitionEnabled, setSpeechRecognitionEnabled] = useState(false);
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();

    const adjustHeight = () => {
        const textarea = ref.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
            textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
        }
    };

    useLayoutEffect(() => {
        adjustHeight();
    }, [value]);

    // El hack: Espera a que se estabilice el DOM
    useEffect(() => {
        setTimeout(() => {
            adjustHeight();
        }, 0);
    }, []);

    useEffect(() => {
        if (speechRecognitionEnabled && transcript) {
            onChange({ target: { value: transcript } });
            adjustHeight();
        }
    }, [transcript, speechRecognitionEnabled]);

    return (
        <XStack f={1}>
            <textarea
                ref={ref}
                readOnly={readOnly}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                onKeyDown={onKeyDown}
                spellCheck={false}
                style={{
                    lineHeight: '1.4',
                    width: '100%',
                    resize: 'none',
                    overflowY: 'hidden',
                    minHeight: `${minHeight}px`,
                    maxHeight: `${maxHeight}px`,
                    boxSizing: 'border-box',
                    border: '1px solid var(--color6)',
                    borderRadius: '8px',
                    padding: '10px',
                    backgroundColor: 'var(--color3)',
                    ...style,
                }}
                {...rest}
            />
            {speechRecognition && browserSupportsSpeechRecognition && <XStack cursor="pointer" onPress={() => {
                if (speechRecognitionEnabled) {
                    setSpeechRecognitionEnabled(false);
                    SpeechRecognition.stopListening();
                    // Stop speech recognition logic here
                } else {
                    resetTranscript();
                    setSpeechRecognitionEnabled(true);
                    SpeechRecognition.startListening({ continuous: true });
                    // Start speech recognition logic here
                }
            }} position="absolute" right="12px" top="12px" gap="$2" opacity={speechRecognitionEnabled ? 1.0 : 0.5} hoverStyle={{opacity: 0.8}} pressStyle={{opacity: 1.0}}>
                <Mic />
            </XStack> }
        </XStack>
    );
};