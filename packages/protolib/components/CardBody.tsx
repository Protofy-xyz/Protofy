import { YStack, Paragraph, YStackProps } from "@my/ui"
import { Tinted } from "./Tinted"

type CardBodyProps = {
    title: any,
    children: any
}
export const CardBody = ({ title, children, ...props }: CardBodyProps & YStackProps) => {
    return <YStack px={"$2"} pb="$5" f={1} {...props}>
        <Tinted>
            <Paragraph mt="20px" ml="20px" fontWeight="700" size="$7">{title}</Paragraph>
            {children}
        </Tinted>
    </YStack>
}