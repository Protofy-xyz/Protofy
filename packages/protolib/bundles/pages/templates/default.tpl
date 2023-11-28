/* @my/ui is wrapper for tamagui. Any component in tamagui con me imported through @my/ui
use result = await API.get(url) or result = await API.post(url, data) to send requests
API.get/API.post will return a pendingAtomResult, with properties like isLoaded, isError and a .data property with the result
if you call paginated apis, you will need to wait for result.isLoaded and look into result.data.items, since result.data is an object with the pagination.
Paginated apis return an object like: {"itemsPerPage": 25, "items": [...], "total": 20, "page": 0, "pages": 1}
if you need to insert an image use "source" prop with the following values {uri:"/logo.png", height: 120, width: 120}
ignore background white, black, or greyscale colors if match with provided wireframe background.
*/

import { Theme, YStack, Text, Spacer, XStack, Paragraph, } from "@my/ui"
import { BigTitle, PageGlow, withSession, Page, useEdit, Center, RainbowText, API } from "protolib"
import { DefaultLayout, } from "../../../layout/DefaultLayout"
import { Protofy } from 'protolib/base'
import { SSR } from 'app/conf'

const isProtected = Protofy("protected", {{protected}})

const PageComponent = () => {
return (
<Page height="99vh">
    <DefaultLayout title="Protofy" description="Made with love from Barcelona">
        {/* add your content here, this is just an example with a big text */}
        <YStack mt="$10">
            <BigTitle>{{name}}</BigTitle>
        </YStack>
    </DefaultLayout>
</Page>
)
}

export default {
    route: Protofy("route", "{{route}}"), /* Don't modify this line*/
    component: () => useEdit(PageComponent, {
        DefaultLayout,
        YStack,
        Spacer,
        Text,
        XStack,
        Paragraph,
        Theme
    },
    "/packages/app/bundles/custom/pages/{{name}}.tsx"),/* Don't modify this line*/
    getServerSideProps: SSR(async (context) => withSession(context, isProtected?Protofy("permissions", {{{permissions}}}):undefined))
}