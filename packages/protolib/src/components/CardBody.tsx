import { YStack, Paragraph, YStackProps, Separator, ParagraphProps, SizableText, SizableTextProps } from "@my/ui"
import { Tinted } from "./Tinted"

type CardBodyProps = {
    title: any,
    subtitle?: any,
    children: any
}
export const CardBody = ({ title, subtitle, children, ...props }: CardBodyProps & YStackProps) => {
    const titleComp = typeof title === 'string' ? <SizableText o={0.8} mt="20px" size="$6" fontWeight="600">{title}</SizableText> : title
    return <YStack px={"$2"} pb="$5" f={1} {...props}>
        <Tinted>
            <YStack ml="10px">
                {titleComp}
                {subtitle}
            </YStack>

        </Tinted>
        <Separator  marginVertical={15} />
        <Tinted>
            {children}
        </Tinted>
    </YStack>
}