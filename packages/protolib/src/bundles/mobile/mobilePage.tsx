/* @my/ui is wrapper for tamagui. Any component in tamagui can be imported through @my/ui
use result = await API.get(url) or result = await API.post(url, data) to send requests
API.get/API.post will return a PendingResult, with properties like isLoaded, isError and a .data property with the result
if you call paginated apis, you will need to wait for result.isLoaded and look into result.data.items, since result.data is an object with the pagination.
Paginated apis return an object like: {"itemsPerPage": 25, "items": [...], "total": 20, "page": 0, "pages": 1}
*/

import { withSession } from '../../lib/Session';
import { Page } from '../../components/Page';
import { Protofy } from 'protobase';
import { SSR } from '../../lib/SSR';
import { Center } from '../../components/Center';
import dynamic from "next/dynamic";
import ReactAccelorometerValue from 'reactaccelerometervalue'

const ActiveFullScreen = dynamic(() =>
    import('./components/ActiveFullScreen').then(module => module.ActiveFullScreen),
    { ssr: false }
);

const Accelerometer = ({ state }) => {
    return <div>
        <p>
            <div>x:{Math.trunc(state.x)}</div>
            <div>y:{Math.trunc(state.y)}</div>
            <div>z:{Math.trunc(state.z)}</div>
            <div>rotation alpha:{Math.trunc(state.rotation.alpha)}</div>
            <div>rotation beta:{Math.trunc(state.rotation.beta)}</div>
            <div>rotation gamma:{Math.trunc(state.rotation.gamma)}</div>
        </p>
    </div>
}

const PageComponent = ({ currentView, setCurrentView, ...props }: any) => {
    return (
        <Page height="99vh">
            <Center>
                <ActiveFullScreen>
                    <ReactAccelorometerValue>
                        <Accelerometer />
                    </ReactAccelorometerValue>
                </ActiveFullScreen>
            </Center>
        </Page>
    )
}

export default {
    route: Protofy("route", "/mobile"),
    component: (props) => <PageComponent {...props} />,
    getServerSideProps: SSR(async (context) => withSession(context, undefined))
}