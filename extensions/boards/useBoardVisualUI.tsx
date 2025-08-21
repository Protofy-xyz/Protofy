import { API } from 'protobase'
import { useEffect, useState } from 'react'
import { palettes } from 'app/bundles/palettes'
import dynamic from 'next/dynamic';
import { getTokens } from '@tamagui/core'
import { uiComponentWrapper } from 'protolib/visualui/visualuiWrapper';
import { Spinner, useToastController, YStack } from '@my/ui'

const UiManager = dynamic(() => import('visualui'), { ssr: false })

export const useBoardVisualUI = ({ boardID }: { boardID: string }) => {
    const [loading, setLoading] = useState(false)
    const [fileContent, setFileContent] = useState()
    const [sharedComponents, setSharedComponents] = useState<any>()
    const toast = useToastController()

    const metadata = {
        "tamagui": getTokens(),
        "context": {}
    }

    const onSave = async (content: string) => {
        const res = await API.post(`/api/core/v1/boards/${boardID}/uicode`, { code: content })
        if (res && res.data) {
            toast.show("UI saved successfully")
        } else if (res && res.error) {
            toast.show("Error saving UI", { tint: "red" })
        }
    }


    const getUiCode = async () => {
        setLoading(true)
        const res = await API.get(`/api/core/v1/boards/${boardID}/uicode`)
        if (res && res.data) {
            setFileContent(res.data.code)
        }
        setLoading(false)
    }

    const getWrappedComponentsFromMetadata = (components: any) => Object.entries(components).reduce<any>((acc, [name, data]: any) => {
        const visualUIData = data.metadata?.visualui
        if (visualUIData) {
            if (!acc.app) {
                acc.app = {}
            }
            if (visualUIData.palette) {
                if (!acc[visualUIData.palette]) {
                    acc[visualUIData.palette] = {}
                }
                acc[visualUIData.palette] = {
                    ...acc[visualUIData.palette],
                    ...uiComponentWrapper(data.component, name, data.metadata.visualui)
                }
            } else {
                if (!acc.app[name]) {
                    acc.app[name] = {
                        component: data.component,
                        metadata: data.metadata
                    }
                }
            }
        }

        return acc
    }, {})


    useEffect(() => {
        getUiCode()
    }, [boardID])

    useEffect(() => {
        if (window && window["ProtoComponents"]) {
            const componentsWithMetadata: any = getWrappedComponentsFromMetadata(window["ProtoComponents"])
            setSharedComponents(componentsWithMetadata)
        }
    }, [])

    return (<>
        {sharedComponents && !loading ? <UiManager
            metadata={metadata}
            userPalettes={{
                atoms: {
                    ...sharedComponents,
                    hmtl: palettes.atoms.html,
                },
                // molecules: {
                // ...palettes.molecules 
                // }
            }}
            _sourceCode={fileContent}
            onSave={onSave}
            contextAtom={undefined}
            settings={{
                editor: {
                    getMainContent: ({ ast, SyntaxKind }: any) => {
                        const widgetFn = ast.getFunction("Widget")
                        if (widgetFn) {
                            const descendant = widgetFn.getFirstDescendantByKind(SyntaxKind.JsxElement);
                            if (descendant) {
                                return descendant;
                            }
                        }
                        return
                    }
                }
            }}
        /> : <YStack jc="center" ai="center" f={1}>
            <Spinner />
        </YStack>
        }
    </>)
}