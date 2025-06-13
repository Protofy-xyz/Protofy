/* @my/ui is wrapper for tamagui. Any component in tamagui can be imported through @my/ui
use result = await API.get(url) or result = await API.post(url, data) to send requests
API.get/API.post will return a PendingResult, with properties like isLoaded, isError and a .data property with the result
if you call paginated apis, you will need to wait for result.isLoaded and look into result.data.items, since result.data is an object with the pagination.
Paginated apis return an object like: {"itemsPerPage": 25, "items": [...], "total": 20, "page": 0, "pages": 1}
*/

import { withSession } from 'protolib/lib/Session';
import { Page } from 'protolib/components/Page';
import { API, Protofy } from 'protobase';
import { SSR } from 'protolib/lib/SSR';
import { Center } from 'protolib/components/Center';
import dynamic from "next/dynamic";
// import ReactAccelorometerValue from 'reactaccelerometervalue'
import useCompass from "react-world-compass"
import { useInterval } from 'usehooks-ts';
import { useMqttState } from 'protolib/lib/mqtt';
const ActiveFullScreen = dynamic(() =>
    import('./components/ActiveFullScreen').then(module => module.ActiveFullScreen),
    { ssr: false }
);

const Accelerometer = ({ state, degrees }) => {
    const {client} = useMqttState()
    useInterval(() => {
        // API.get("/api/v1/mobile/data?degrees=" + degrees + "&x=" + state.x + "&y=" + state.y + "&z=" + state.z + "&alpha=" + state.rotation.alpha + "&beta=" + state.rotation.beta + "&gamma=" + state.rotation.gamma)
        client.publish("mobile/data", JSON.stringify({degrees: degrees, x: state.x, y: state.y, z: state.z, alpha: state.rotation.alpha, beta: state.rotation.beta, gamma: state.rotation.gamma}))
    }, 100)
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
    const degree = useCompass(20)

    
    return (
        <Page height="99vh">
            <Center>
                <ActiveFullScreen>
                    {/* <ReactAccelorometerValue>
                        {degree && <Accelerometer degrees={degree?.degree.toFixed(0)} />}
                        {degree && <div>Compass: {degree.degree}</div>}
                    </ReactAccelorometerValue> */}
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