import { YStack, Paragraph } from "@my/ui"
import { Tinted } from "./Tinted"

type CardBodyProps = {
    title: any,
    children: any
}
export const CardBody = ({ title, children }: CardBodyProps) => {
    return <YStack px={"$2"} pb="$5" f={1}>
        <Tinted>
            <Paragraph mt="20px" ml="20px" fontWeight="700" size="$7">{title}</Paragraph>
            {children}
        </Tinted>
    </YStack>
}