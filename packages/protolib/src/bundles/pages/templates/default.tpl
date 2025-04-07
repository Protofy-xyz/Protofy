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
import { useComposedState } from 'protolib/lib/useComposedState'
import { Text } from 'protolib/components/Text';
import { VStack } from 'protolib/components/VStack';
import { BigTitle} from 'protolib/components/BigTitle'
import { API, Protofy } from 'protobase';
import { Page } from 'protolib/components/Page';
import { DefaultLayout, } from '../layout/DefaultLayout'
import { context } from '../bundles/uiContext';
import { useRouter } from 'solito/navigation';
import { Objects } from '../bundles/objects';

const isProtected = Protofy("protected", {{protected}})
const permissions = isProtected?Protofy("permissions", {{{permissions}}}):null
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
                <VStack mt="$10" ai="center">
                    <BigTitle>{{name}}</BigTitle>
                </VStack>
            </DefaultLayout>
        </Page>
)}

export default {
    route: Protofy("route", "{{route}}"),
    component: (props) => <PageComponent {...props} />
}