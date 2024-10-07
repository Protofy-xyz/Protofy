import { YStack, Paragraph, YStackProps, Separator, ParagraphProps, SizableText, SizableTextProps } from "@my/ui"
import { Tinted } from "./Tinted"

type CardBodyProps = {
    title: any,
    subtitle?: any,
    children: any,
    separator?: boolean
}
export const CardBody = ({ title, subtitle, separator = true, children, ...props }: CardBodyProps & YStackProps) => {
    const titleComp = typeof title === 'string' ? <SizableText mt="20px" size="$8" fontWeight="600">{title}</SizableText> : title
    return <YStack px={"$2"} pb="$5" f={1} {...props}>
        <Tinted>
            <YStack ml="10px">
                {titleComp}
                {subtitle}
            </YStack>

        </Tinted>
        {separator && <Separator  marginVertical={15} />}
        <Tinted>
            {children}
        </Tinted>
    </YStack>
}