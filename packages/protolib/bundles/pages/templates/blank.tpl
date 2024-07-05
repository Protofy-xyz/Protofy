/* @my/ui is wrapper for tamagui. Any component in tamagui can be imported through @my/ui
use result = await API.get(url) or result = await API.post(url, data) to send requests
API.get/API.post will return a PendingResult, with properties like isLoaded, isError and a .data property with the result
if you call paginated apis, you will need to wait for result.isLoaded and look into result.data.items, since result.data is an object with the pagination.
Paginated apis return an object like: {"itemsPerPage": 25, "items": [...], "total": 20, "page": 0, "pages": 1}
*/

import React, { useState } from 'react'
import { Theme } from '@my/ui'
import { UIWrapLib, UIWrap } from 'protolib/visualui/visualuiWrapper'
import { withSession } from 'protolib/lib/Session';
import { Page } from 'protolib/components/Page';
import { useEditor } from 'protolib/visualui/useEdit';
import { API } from 'protolib/base/Api';
import { SSR } from 'protolib/lib/SSR';
import { useComposedState } from 'protolib/lib/useComposedState';
import { Text } from 'protolib';
import { Center } from 'protolib';
import { DefaultLayout, } from '../../../layout/DefaultLayout'
import { Protofy } from 'protolib/base'
import { context } from 'app/bundles/uiContext';
import { useRouter } from 'solito/navigation';
import { Objects } from 'app/bundles/objects';


const isProtected = Protofy("protected", {{protected}})
Protofy("pageType", "blank")

const PageComponent = ({ currentView, setCurrentView, ...props }: any) => {
    const { cs, states } = useComposedState();

    const router = useRouter();
    context.onRender(() => {

    });
    return (
        <Page height="99vh">
            <Center>
            </Center>
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