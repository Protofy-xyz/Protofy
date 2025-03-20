
import { API } from 'protobase'
import { YStack, XStack, Button, Spinner, useToastController } from '@my/ui'
import { Tinted } from '../../components/Tinted'
import { Rules } from '../../components/autopilot/Rules'
import { Monaco } from '../../components/Monaco'
import { useState, useRef, useMemo } from 'react'
import { useThemeSetting } from '@tamagui/next-theme'
import { Panel, PanelGroup } from "react-resizable-panels";
import CustomPanelResizeHandle from '../MainPanel/CustomPanelResizeHandle'


export const RulesSideMenu = ({ boardRef, board, actions, states }) => {
    const { resolvedTheme } = useThemeSetting();
    const [savedRules, setSavedRules] = useState(board.rules)
    const savedCode = useRef(board.rulesCode)
    const editedCode = useRef(board.rulesCode)
    const [generatingBoardCode, setGeneratingBoardCode] = useState(false)
    const toast = useToastController()


    //useMemo to keep monaco editor from re-rendering
    const monacoEditor = useMemo(() => {
        return <Monaco
            path={'sidemenu-rules.ts'}
            darkMode={resolvedTheme === 'dark'}
            sourceCode={savedCode.current}
            onChange={(text) => {
                editedCode.current = text
            }}
            onMount={(editor) => {
                editedCode.current = savedCode.current
            }}
            options={{
                folding: false,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 0,
                lineNumbers: false,
                minimap: { enabled: false }
              }}
        />
    }, [resolvedTheme, savedCode.current])

    return <YStack w="100%" backgroundColor="transparent" p="$3" br={9} boxShadow="0 0 10px rgba(0,0,0,0.1)">
        <Tinted>
            <PanelGroup direction="vertical">
                <Panel defaultSize={66} minSize={20} maxSize={80}>
                    <YStack
                        flex={1} height="100%" alignItems="center" justifyContent="center" boxShadow="0 0 10px rgba(0,0,0,0.1)" borderRadius="$3" p="$3" >
                        <Rules
                            rules={savedRules ?? []}
                            onAddRule={(e, rule) => {
                                setSavedRules([...(savedRules ?? []), rule])
                            }}
                            onDeleteRule={(index) => {
                                setSavedRules(savedRules.filter((_, i) => i != index))
                            }}
                            onEditRule={(index, rule) => {
                                const newRules = [...savedRules]
                                newRules[index] = rule
                                setSavedRules(newRules)
                            }}
                            loadingIndex={-1}
                        />
                        <YStack mt="auto" pt="$3">

                        </YStack>
                    </YStack>
                </Panel>
                <CustomPanelResizeHandle direction="horizontal" />
                <Panel defaultSize={34} minSize={20} maxSize={80}>
                    <YStack flex={1} height="100%" alignItems="center" justifyContent="center" boxShadow="0 0 10px rgba(0,0,0,0.1)" borderRadius="$3" p="$3" >
                        {monacoEditor}
                        <XStack mt="auto" pt="$3" gap={30}>
                            <Button onPress={async () => {
                                setGeneratingBoardCode(true)
                                try {
                                    boardRef.current.rules = savedRules
                                    const rulesCode = await API.post(`/api/core/v1/autopilot/getBoardCode`, { rules: savedRules, states: states.boards[board.name], actions: actions.boards[board.name] })
                                    boardRef.current.rulesCode = rulesCode.data.jsCode
                                    savedCode.current = rulesCode.data.jsCode
                                    await API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)

                                    // boardRef.current.rules = []
                                    // await API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)
                                    toast.show(`Rules applied successfully!`)
                                } catch (e) {
                                    toast.show(`Error generating board code: ${e.message}`)
                                    console.error(e)
                                } finally {
                                    setGeneratingBoardCode(false)
                                }
                            }}>
                                {generatingBoardCode ? <Spinner /> : 'Apply Rules'}
                            </Button>
                            <Button onPress={() => {
                                boardRef.current.rulesCode = editedCode.current
                                API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)
                            }}>
                                Save
                            </Button>
                        </XStack>
                    </YStack>
                </Panel>
            </PanelGroup>
        </Tinted>
    </YStack>
}