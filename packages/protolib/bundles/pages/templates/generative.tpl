/*
All imports from 'tamagui' have to use alias '@my/ui'.
Preserve all imports and structure from the provided code below.
You have to follow and support on the comments of the provided code.
If you have to add images use: Image component from protolib and don't add url prop
*/
import { Theme, YStack, Text, Spacer, XStack, Paragraph, } from "@my/ui"
import { BigTitle, PageGlow, withSession, Page, useEdit, Center, RainbowText, ThemeTint } from "protolib"
import { DefaultLayout, } from "../../../layout/DefaultLayout"
import { Protofy } from 'protolib/base'
import { SSR } from 'app/conf'
// Here add missing imports

const isProtected = Protofy("protected", {{protected}})

const PageComponent = () => {
    return (
        <Page height="99vh">
            <ThemeTint>
                {/*Here goes the code*/}
            </ThemeTint>
        </Page>)
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
    getServerSideProps: SSR(async (context) => withSession(context, isProtected?Protofy("permissions", {{permissions}}):undefined))
}