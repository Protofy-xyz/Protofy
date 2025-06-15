import { Text, YStack } from '@my/ui';
import { Fan } from '@tamagui/lucide-icons';
import { CenterCard } from '@extensions/services/widgets';

export const MotorCard = ({ value }) => {
    const fan = () => {
        const props = {
            color: "var(--color7)",
            size: 48,
            strokeWidth: 1.75
        }
        switch (value) {
            case "clockwise":
                return <>
                    <Fan
                        className="rotating"
                        {...props}
                    />
                </>
            case "counter-clockwise":
                return <Fan
                    className="rotating-reverse"
                    {...props}
                />
            default:
                return <Fan {...props} />
        }
    }
    const getText = () => {
        switch (value) {
            case "clockwise":
                return "clockwise"
            case "counter-clockwise":
                return "counter"
            case "stop":
                return "stop"
            case "off":
                return "off"
            default:
                return "-"
        }
    }

    return (
        <CenterCard title={"motor"} id={"motor"}>
            <YStack alignItems='center' justifyContent='center'>
                {fan()}
                {/* <Chip size="$8" text={getText()} textProps={{size: "$6"}}></Chip> */}
                <Text mt={10} fontSize={48} fontWeight="bold" color="$primary">
                    {getText()}
                </Text>
            </YStack>
        </CenterCard>
    );
};
