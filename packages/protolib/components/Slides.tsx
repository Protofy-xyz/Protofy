import { InteractiveIcon } from 'protolib'
import { XStack, YStack } from '@my/ui'
import { ChevronLeft, ChevronRight  } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Tinted } from './Tinted'


export const Slides = ({ slides }) => {
    const [step, setStep] = useState(0)
    const totalSlides = slides.length
    const prev_step = step > 1 ? step - 1 : 0
    const post_step = step < totalSlides - 1 ? step + 1 : null

    return (
        <XStack ai="center" w="40vw" h="70vh" minWidth={"800px"}>
            <Tinted>
                <InteractiveIcon
                    Icon={ChevronLeft}
                    onPress={(e) => {
                        e.stopPropagation();
                        if(step>0){
                            setStep(prev_step)
                        }

                    }} ml={"$3"}
                    disabled={step === 0} />

                <YStack>
                    <h1>{slides[step].title}</h1>
                </YStack>

                <InteractiveIcon
                    Icon={ChevronRight}
                    onPress={(e) => {
                        e.stopPropagation();
                        if(post_step) {
                            setStep(post_step)
                        }
                    }}
                    ml={"$3"}
                    disabled={post_step?false:true} />
            </Tinted>
        </XStack>
    );
}