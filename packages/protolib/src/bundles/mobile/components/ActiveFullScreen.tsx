import React, { use, useEffect } from "react";
import { useWakeLock } from 'react-screen-wake-lock';
import { Button } from "@my/ui";
import { useUpdateEffect } from 'usehooks-ts';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

export const ActiveFullScreen = ({ children }) => {
    const handle = useFullScreenHandle();

    const { isSupported, released, request, release } = useWakeLock({
        onRequest: () => { }, //alert('Screen Wake Lock: requested!'),
        onError: () => alert('An error happened 💥'),
        onRelease: () => { } //alert('Screen Wake Lock: released!'),
    });

    useUpdateEffect(() => {
        if (!released) {
            // alert('running')
        }
    }, [released])

    const joinSession = async () => {
        await handle.enter()
        if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock("portrait-primary");
            console.log("Orientación bloqueada en portrait");
        } else {
            console.warn("API Screen Orientation no soportada en este navegador");
        }
        request()
    }

    useEffect(() => {
        if (!handle.active) {
            release() //release handle when leaving fullscreen
        }
    }, [handle.active])

    return <div>
        {/* <p>
            Screen Wake Lock API supported: <b>{`${isSupported}`}</b>
            <br />
            Released: <b>{`${released}`}</b>
        </p> */}
        <FullScreen handle={handle}>
            <div className="fullscreen-container">
                {handle.active && children}
            </div>
        </FullScreen>
        <Button onPress={joinSession}>
            {released === false ? 'Stop' : 'Start'}
        </Button>
    </div>
};