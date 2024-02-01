import { Editor, Element, Frame, useNode, useEditor } from "@craftjs/core";
import { BigTitle, Monaco, Page, useAtom } from "protolib";
import protolibPallete from 'protolib/visualui/index'
import { useEffect, useRef, useState } from "react";
import { Source } from "app/models";
import palettes from "visualui/src/palettes";
import { RenderNode } from "visualui/src/components/RenderNode";
import { SourceAtomFactory, useVisualUi } from "visualui";

const Builder = () => {
    const [craftNodes, setCraftNodes] = useState({})
    const [initialJson, setInitialJson] = useState()
    const paper = useRef<any>()
    const [loading, setLoading] = useState(true)

    const { connectors, actions, query, selectedNodeId } = useEditor((state: Node) => {
        return {
            selectedNodeId: state.events.selected
        }
    })

    const loadEditorNodes = async () => {
        const source: Source = Source.new(sourceCode)
        let editorNodes = source.data()
        setInitialJson(editorNodes)
        const availableComponents = query?.getOptions()?.resolver ?? {}
        const availableCompArr = Object.keys(availableComponents)

        try {
            var unknownNodes: any = {}
            Object.keys(editorNodes).forEach(n => {
                if (!availableCompArr.includes(editorNodes[n].displayName)) {
                    let replacedNode = {
                        ...editorNodes[n],
                        custom: {
                            ...editorNodes[n].custom,
                            unknown: true
                        },
                        type: {
                            ...editorNodes[n].type,
                            resolvedName: "Unknown"
                        }
                    }
                    unknownNodes[n] = replacedNode
                }
            })
            actions.deserialize({ ...editorNodes, ...unknownNodes })
        } catch (e) {
            throw "Error loading editor nodes"
        }
    }

    useEffect(() => {
        const reload = async (retry: number) => {
            try {
                setLoading(true)
                await loadEditorNodes()
                setLoading(false)
            } catch (e) {
                if (retry < 10) {
                    setTimeout(() => reload(retry + 1), 5000)
                    setLoading(true)
                } else {
                    console.error(`Max retry reached! Error deserializing editor nodes(CraftJS nodes).Error: ${e}`)
                }
                console.error(`Error deserializing editor nodes(CraftJS nodes).Error: ${e}`)
            }
        }
        if (sourceCode) {
            reload(0)
        }
    }, [sourceCode])


    return <>
        {
            <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw', backgroundColor: '#151515' }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '40%', backgroundColor: '#141414' }}>
                    <Monaco
                        onChange={(newVal) => {
                            setSourceCode(newVal)
                        }}
                        sourceCode={sourceCode}
                        theme="vs-dark"
                        defaultLanguage="javascript"
                        options={{
                            minimap: {
                                enabled: 'false'
                            },
                            padding: {
                                top: 20,
                                right: 20
                            },
                        }}
                    />
                </div>
                {/* this page container should go above the frame not here, for the moment let's leave here since it works */}
                <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '60%', backgroundColor: 'transparent' }}>
                    <p style={{
                        position: 'absolute', bottom: '15px', right: '15px', color: 'white', backgroundColor: '#0056ff', padding: '7px 10px',
                        borderRadius: '5px'
                    }}>{selectedNodeId}</p>
                    <div
                        /* @ts-ignore */
                        ref={(ref) => { connectors.select(connectors.hover(ref, null), null) }}
                        style={{
                            display: 'flex', position: 'relative', flexDirection: 'column', height: '100%', width: '100%', justifyContent: 'flex-start',
                            alignItems: 'flex-start', backgroundColor: '#ececec', overflow: 'scroll'
                        }}>
                        <Frame />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <h1>john doe</h1>
                    </div>
                </div>
            </div>
        }
    </>
}

const a = SourceAtomFactory("<p>hola</p>")
export default function BuilderWrapper() {
    /*   const [sourceCode, setSourceCode] = useAtom(SourceAtomFactory(`import { BigTitle, Page, UIWrapLib } from "protolib";
    
      const isProtected = Protofy("protected", false);
      
      const Home = (props) => {
        return (
          <Page id="custom-id">
            <BigTitle>Hello</BigTitle>
            <XCenterStack padding="30px">
              <BigTitle>world</BigTitle>
            </XCenterStack>
          </Page>
        );
      };
      
      const cw = UIWrapLib('@my/ui')
      
      export default {
        route: Protofy("route", "/"),
        component: (props) =>
          useEdit(
            () => Home(props),
            {
              ...UIWrap("DefaultLayout", DefaultLayout, "../../../layout/DefaultLayout"),
            },
            "/packages/app/bundles/custom/pages/home.tsx"
          ),
        getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined)),
      };
      
      `))
     */

    const [sourceCode, set]= useVisualUi(a);
    useEffect(() => {
        console.log('visualui, ', sourceCode)
    }, [sourceCode])


    return <button
        onClick={() => {
            set()
            set.ast("<p>hola</p>")
        }}
    >
        for two
    </button>
    return <Editor resolver={{
        ...protolibPallete,
        ...palettes.craft
    }}
        indicator={{
            transition: 'none',
            success: 'green',
            error: 'red'
        }}
        onRender={RenderNode}
        onNodesChange={(newNodes) => {
            console.log('new nodes', newNodes.getNodes())
        }}
    >
        {/* <Builder /> */}
    </Editor>
}