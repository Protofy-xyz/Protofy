import { XStack, YStack, Text, Stack, Button } from '@my/ui'
import { useState } from 'react'
import { Tinted } from './Tinted'


export const Slides = ({ slides, lastButtonCaption, onFinish, id = "pages" }) => {
    const [step, setStep] = useState(0)
    const totalSlides = slides.length
    const prev_step = step > 1 ? step - 1 : 0
    const post_step = step < totalSlides - 1 ? step + 1 : null

    const titlesUpToCurrentStep = slides
        .filter((_, index) => index <= step)
        .map(slide => slide.name)
        .join(" / ");

    return (
        <YStack id="admin-dataview-create-dlg" width={800} maxHeight={700} padding="$3" flex={1}>
            <XStack id="admin-eo" marginTop="$4" justifyContent="space-between" width="100%">
                <Stack flex={1}>
                    <Text fontWeight={"500"} fontSize={16} color="$gray9">{titlesUpToCurrentStep}</Text>
                </Stack>
                <Stack flex={1} alignItems="flex-end">
                    <Text fontWeight={"500"} fontSize={16} color="$gray9">[{step + 1}/{totalSlides}]</Text>
                </Stack>
            </XStack>

            <Tinted>
                <Stack>
                    <Text fontWeight={"600"} fontSize={34} color="$color9">{slides[step].title}</Text>
                </Stack>
            </Tinted>

            <Stack marginTop={"$6"}>
                {slides[step].component}
            </Stack>

            <XStack gap={40} justifyContent='center' marginBottom={"$5"} flex={1} alignItems="flex-end">
                {step !== 0 ? <Button width={250} onPress={(e) => {
                    e.stopPropagation();
                    if (step > 0) {
                        setStep(prev_step)
                    }
                }} >Back
                </Button> : <></>}
                <Tinted>
                    <Button id={"admin-" + id + "-add-btn"} width={250} onPress={async (e) => {
                        e.stopPropagation();
                        if (post_step) {
                            setStep(post_step)
                        } else {
                            if (onFinish) {
                                await onFinish()
                            }
                        }
                    }} >{totalSlides === step + 1 ? lastButtonCaption : "Next"}
                    </Button>
                </Tinted>
            </XStack>

        </YStack>
    );
}