/* @my/ui is wrapper for tamagui. Any component in tamagui can be imported through @my/ui
use result = await API.get(url) or result = await API.post(url, data) to send requests
API.get/API.post will return a PendingResult, with properties like isLoaded, isError and a .data property with the result
if you call paginated apis, you will need to wait for result.isLoaded and look into result.data.items, since result.data is an object with the pagination.
Paginated apis return an object like: {"itemsPerPage": 25, "items": [...], "total": 20, "page": 0, "pages": 1}
*/

import { Theme, YStack, Text, Spacer, XStack, Paragraph, } from "@my/ui"
import { UIWrapLib, UIWrap, BigTitle, PageGlow, withSession, Page, useEdit, Center, RainbowText, API, SSR} from "protolib"
import { DefaultLayout, } from "../../../layout/DefaultLayout"
import { Protofy } from 'protolib/base'

const isProtected = Protofy("protected", {{protected}})

const PageComponent = (props) => {
    return (
        <Page height="99vh">

        </Page>)
}

const cw = UIWrapLib('@my/ui')

export default {
    route: Protofy("route", "{{route}}"),
    component: (props) => useEdit(
        () => PageComponent(props), {
        ...UIWrap("DefaultLayout", DefaultLayout, "../../../layout/DefaultLayout"),
        ...cw("YStack", YStack),
        ...cw("Spacer", Spacer),
        ...cw("Text", Text),
        ...cw("XStack", XStack),
        ...cw("Paragraph", Paragraph),
        ...cw("Theme", Theme)
    }, "/packages/app/bundles/custom/pages/{{name}}.tsx"),
    getServerSideProps: SSR(async (context) => withSession(context, isProtected?Protofy("permissions", {{permissions}}):undefined))
}