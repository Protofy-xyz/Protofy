/* @my/ui is wrapper for tamagui. Any component in tamagui can be imported through @my/ui
use result = await API.get(url) or result = await API.post(url, data) to send requests
API.get/API.post will return a PendingResult, with properties like isLoaded, isError and a .data property with the result
if you call paginated apis, you will need to wait for result.isLoaded and look into result.data.items, since result.data is an object with the pagination.
Paginated apis return an object like: {"itemsPerPage": 25, "items": [...], "total": 20, "page": 0, "pages": 1}
*/

import { Protofy, API } from 'protobase'
import { SSR } from 'protolib/lib/SSR';
import { useWorkspaceUrl, getWorkspaceApiUrl } from 'protolib/lib/useWorkspaceEnv'
import { useRedirectToEnviron } from 'protolib/lib/useRedirectToEnviron'
import { AdminPage } from 'protolib/components/AdminPage'
import { context } from '../bundles/uiContext'
import { useRouter } from 'solito/navigation'
import { withSession } from 'protolib/lib/Session';
import { VStack } from 'protolib/components/VStack';
import { BigTitle} from 'protolib/components/BigTitle'

const Icons =  {}
const isProtected = Protofy("protected", {{protected}})

Protofy("pageType", "admin")

export default {
    route: Protofy("route", "{{route}}"),
    component: ({pageState, initialItems, pageSession, extraData}:any) => {
        useRedirectToEnviron()
        const getWorkspaceUrl = useWorkspaceUrl()

        return (<AdminPage title="{{name}}" pageSession={pageSession}>
                <VStack mt="$10" ai="center" f={1}>
                    <BigTitle>{{name}}</BigTitle>
                </VStack>
        </AdminPage>)
    }, 
    getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined))
}