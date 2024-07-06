import { Popover, Square } from "@my/ui"
import { SketchPicker } from "react-color";
import { Input } from "./Input";

type Props = {
    color: string,
    onChange: (color: any) => void,
    placeholder?: string
}

export const InputColor = ({ color, onChange, placeholder }: Props) => {

    return <Popover
        allowFlip
    >
        <Popover.Trigger f={1}>
            <Input
                f={1}
                value={color}
                placeholder={placeholder ?? "#000000"}
            />
            <Square
                size="$2"
                backgroundColor={color}
                borderColor="$color"
                borderRadius="$2"
                cursor="pointer"
                position="absolute"
                borderWidth="$0.5"
                right="8px"
                top="8px"
            />
        </Popover.Trigger>
        <Popover.Content width='250px' shadowRadius={"$4"} shadowColor={"black"} shadowOpacity={0.3}>
            <SketchPicker
                color={color}
                presetColors={[]}
                onChange={onChange}
                disableAlpha={true}
                styles={{
                    default: {
                        picker: {
                            background: 'transparent',
                            border: '0px',
                            boxShadow: 'none',
                            width: '210px',
                        }
                    }
                }}
            />
        </Popover.Content>
    </Popover>
}