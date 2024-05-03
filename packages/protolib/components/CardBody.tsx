import { YStack, Paragraph, YStackProps, Separator } from "@my/ui"
import { Tinted } from "./Tinted"

type CardBodyProps = {
    title: any,
    subtitle?: any,
    children: any
}
export const CardBody = ({ title, subtitle, children, ...props }: CardBodyProps & YStackProps) => {
    return <YStack px={"$2"} pb="$5" f={1} {...props}>
        <Tinted>
            <YStack ml="10px">
                <Paragraph mt="20px" fontWeight="900" size="$5">{title}</Paragraph>
                {subtitle}
            </YStack>

        </Tinted>
        <Separator  marginVertical={15} />
        <Tinted>
            {children}
        </Tinted>
    </YStack>
}