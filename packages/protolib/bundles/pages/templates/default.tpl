import { Theme, YStack, Text, Spacer, XStack, Paragraph, } from "@my/ui"
import { BigTitle, PageGlow, withSession, Page, useEdit, Center, RainbowText } from "protolib"
import { DefaultLayout, } from "../../../layout/DefaultLayout"
import { Protofy } from 'protolib/base'
import { SSR } from 'app/conf'

const isProtected = Protofy("protected", {{protected}})

const PageComponent = () => {
    return (
    <Page height="99vh">
        <DefaultLayout title="Protofy" description="Made with love from Barcelona">
            <YStack mt="$10">
            <BigTitle>{{name}}</BigTitle>
            </YStack>
        </DefaultLayout>
    </Page>
    )
}

export default {
    route: Protofy("route", "{{route}}"),
    component: () => useEdit(PageComponent, {
        DefaultLayout,
        YStack,
        Spacer,
        Text,
        XStack,
        Paragraph,
        Theme
    }, "/packages/app/bundles/custom/pages/{{name}}.tsx"),
    getServerSideProps: SSR(async (context) => withSession(context, isProtected?Protofy("permissions", {{{permissions}}}):undefined))
}