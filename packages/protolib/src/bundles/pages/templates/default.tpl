/* @my/ui is wrapper for tamagui. Any component in tamagui can be imported through @my/ui
use result = await API.get(url) or result = await API.post(url, data) to send requests
API.get/API.post will return a PendingResult, with properties like isLoaded, isError and a .data property with the result
if you call paginated apis, you will need to wait for result.isLoaded and look into result.data.items, since result.data is an object with the pagination.
Paginated apis return an object like: {"itemsPerPage": 25, "items": [...], "total": 20, "page": 0, "pages": 1}
If you need to insert an image use "source" prop with the following values {uri:"/logo.png", height: 120, width: 120}
Ignore background white, black, or greyscale colors if match with provided wireframe background.
Don't modify export default object
*/

import React, { useState } from 'react'
import { Theme } from '@my/ui'
import { useComposedState } from 'protolib/dist/lib/useComposedState'
import { Text } from 'protolib/dist/components/Text';
import { VStack } from 'protolib/dist/components/VStack';
import { useEditor } from 'protolib/dist/visualui/useEdit';
import { BigTitle} from 'protolib/dist/components/BigTitle'
import { UIWrapLib, UIWrap } from 'protolib/dist/visualui/visualuiWrapper'
import { API, Protofy } from 'protobase';
import { withSession } from 'protolib/dist/lib/Session';
import { Page } from 'protolib/dist/components/Page';
import { SSR } from 'protolib/dist/lib/SSR';
import { DefaultLayout, } from '../../../layout/DefaultLayout'
import { context } from 'app/bundles/uiContext';
import { useRouter } from 'solito/navigation';
import { Objects } from 'app/bundles/objects';

const isProtected = Protofy("protected", {{protected}})
Protofy("pageType", "default")

const PageComponent = ({ currentView, setCurrentView, ...props }: any) => {
    const { cs, states } = useComposedState();

    const router = useRouter();
    context.onRender(() => {

    });
    return (
        <Page minHeight="100vh">
            <DefaultLayout title="Protofy" description="Made with love from Barcelona">
                {/* add your content here, this is just an example with a big text */}
                <VStack marginTop="$10" alignItems="center">
                    <BigTitle>{{name}}</BigTitle>
                </VStack>
            </DefaultLayout>
        </Page>
)
}

const cw = UIWrapLib('@my/ui')

export default {
    route: Protofy("route", "{{route}}"),
    component: (props) => {
        const [currentView, setCurrentView] = useState("default");

        return useEditor(
            <PageComponent currentView={currentView} setCurrentView={setCurrentView} {...props} />,
            {
                path: "/packages/app/bundles/custom/pages/{{name}}.tsx",
                context: {
                    currentView: currentView,
                    setCurrentView: setCurrentView,
                    Objects: Objects
                },
                components: {
                    ...UIWrap("DefaultLayout", DefaultLayout, "../../../layout/DefaultLayout"),
                    ...cw("Theme", Theme)
                }
            },
        )
    },
    getServerSideProps: SSR(async (context) => withSession(context, isProtected?Protofy("permissions", {{{permissions}}}):undefined))
}