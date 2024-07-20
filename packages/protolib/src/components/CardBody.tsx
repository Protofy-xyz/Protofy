import { YStack, Paragraph, YStackProps, Separator, ParagraphProps, SizableText, SizableTextProps } from "@my/ui"
import { Tinted } from "./Tinted"

type CardBodyProps = {
    title: any,
    subtitle?: any,
    children: any
}
export const CardBody = ({ title, subtitle, children, ...props }: CardBodyProps & YStackProps) => {
    const titleComp = typeof title === 'string' ? <SizableText opacity={0.8} marginTop="20px" size="$6" fontWeight="600">{title}</SizableText> : title
    return <YStack paddingHorizontal={"$2"} paddingBottom="$5" flex={1} {...props}>
        <Tinted>
            <YStack marginLeft="10px">
                {titleComp}
                {subtitle}
            </YStack>

        </Tinted>
        <Separator marginVertical={15} />
        <Tinted>
            {children}
        </Tinted>
    </YStack>
}