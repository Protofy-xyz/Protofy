import { XStack } from "@my/ui"
import { processFloatingBar } from "app/bundles/actionBar"
import { useRouter } from 'next/router'
import { createElement } from "react"

export const useActionBar = (floatingBar?, onFloatingBarEvent?) => {
    const router = useRouter()

    let currentBar

    if (floatingBar) {
        currentBar = floatingBar
    } else {
        currentBar = processFloatingBar(router, floatingBar, onFloatingBarEvent)
    }

    return currentBar && currentBar.content?.length > 0 && <XStack p="$2" als="center" pos="fixed" elevation={10} bw={1} boc="$gray6" animation="quick" bc="$bgPanel" zi={99999} b={currentBar.visible === false ? -200 : 16} gap="$3" br="$5">
        {
            currentBar.content?.map((item, index) => {
                return item
            })
        }
    </XStack>
}   