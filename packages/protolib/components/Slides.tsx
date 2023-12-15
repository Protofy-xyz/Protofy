import { InteractiveIcon } from 'protolib'
import { XStack, YStack, Text, Stack } from '@my/ui'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Tinted } from './Tinted'


export const Slides = ({ slides }) => {
    const [step, setStep] = useState(0)
    const totalSlides = slides.length
    const prev_step = step > 1 ? step - 1 : 0
    const post_step = step < totalSlides - 1 ? step + 1 : null

    const titlesUpToCurrentStep = slides
        .filter((_, index) => index <= step)
        .map(slide => slide.title)
        .join(" / ");

    return (
        <YStack w="40vw" h="70vh" minWidth={"800px"} p="$3" f={1}>
            <Tinted>
                <XStack mt="$4" justifyContent="space-between" width="100%">
                    <Stack flex={1}>
                        <Text fontWeight={"600"} fontSize={16} color="$gray9">{titlesUpToCurrentStep}</Text>
                    </Stack>
                    <Stack flex={1} alignItems="flex-end">
                        <Text fontWeight={"600"} fontSize={16} color="$gray9">[{step+1}/{totalSlides}]</Text>
                    </Stack>
                </XStack>

                <InteractiveIcon
                    Icon={ChevronRight}
                    onPress={(e) => {
                        e.stopPropagation();
                        if (post_step) {
                            setStep(post_step)
                        }
                    }}
                    ml={"$3"}
                    disabled={post_step ? false : true} />
                <InteractiveIcon
                    Icon={ChevronLeft}
                    onPress={(e) => {
                        e.stopPropagation();
                        if (step > 0) {
                            setStep(prev_step)
                        }

                    }} ml={"$3"}
                    disabled={step === 0} />
            </Tinted>
        </YStack>
    );
}