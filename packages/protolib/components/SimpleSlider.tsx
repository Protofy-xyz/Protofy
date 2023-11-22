import { Stack, XStack, SliderProps, Slider, StackProps } from "tamagui";

export function SimpleSlider({ showLabel=true, containerProps, defaultValue, children, ...props }: {showLabel?: boolean,containerProps: StackProps} & SliderProps) {
    return (
        <XStack f={1} {...containerProps}>
            <XStack f={1}>
                <Slider f={1} defaultValue={[50]} min={0} max={100} step={1} {...props}>
                    <Slider.Track f={1}>
                        <Slider.TrackActive />
                    </Slider.Track>
                    <Slider.Thumb index={0} size="$1" circular elevate />
                    {children}
                </Slider>
            </XStack>
            {showLabel && <Stack ai="flex-end" minWidth={40} top={-8}>{props.value}</Stack>}
        </XStack>
    )
}