import React, { useEffect, useState } from "react";
import { Spinner } from '@my/ui';

const loadEspWebToolsScript = () => {
    return new Promise<void>((resolve) => {
        const scriptExists = document.querySelector('script[src*="esp-web-tools"]');
        if (scriptExists) return resolve();
        const script = document.createElement('script');
        script.src = "https://unpkg.com/esp-web-tools@10/dist/web/install-button.js?module";
        script.type = "module";
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script); // append esp-web-tools to the body for example: esp-web-install-button
    });
};

export const EspWebInstall = {
    ModalButton: ({ manifestUrl, onPress }: { manifestUrl: string, onPress?: () => void }) => {
        const [isReady, setIsReady] = useState(false);

        useEffect(() => {
            loadEspWebToolsScript()
                .then(() => requestAnimationFrame(() => setIsReady(true)));
        }, []);

        if (!isReady) return <Spinner />;

        return <button onClick={() => {
            onPress && onPress()
            console.log("Manifest URL being passed:", manifestUrl);
        }}
        >
            <esp-web-install-button manifest={manifestUrl}>
                <button slot="activate"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: 'black',
                        color: 'white',
                        borderRadius: '10px',
                        width: '100px',
                        textAlign: 'center'
                    }} >
                    Select
                </button>
                <span slot="unsupported">Ah snap, your browser is not supported!</span>
                <span slot="not-allowed">Ah snap, you are not allowed to use this on HTTP!</span>
            </esp-web-install-button>
        </button>
    }

}