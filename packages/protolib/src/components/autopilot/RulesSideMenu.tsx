
import { API } from 'protobase'
import { YStack, XStack, ToggleGroup, Button, Spinner, useToastController } from '@my/ui'
import { Tinted } from '../../components/Tinted'
import { Rules } from '../../components/autopilot/Rules'
import { Monaco } from '../../components/Monaco'
import { useState, useRef } from 'react'
import { useThemeSetting } from '@tamagui/next-theme'


export const RulesSideMenu = ({ boardRef, board, actions, states }) => {
    const [tab, setTab] = useState("rules");
    const { resolvedTheme } = useThemeSetting();
    const [savedRules, setSavedRules] = useState(board.rules)
    const savedCode = useRef(board.rulesCode)
    const [generatingBoardCode, setGeneratingBoardCode] = useState(false)
    const toast = useToastController()

    return <YStack w="100%" backgroundColor="transparent" p="$3" br={9} boxShadow="0 0 10px rgba(0,0,0,0.1)">
        <Tinted>
            {/* Toggle de Tabs */}
            <XStack width="100%" pt="$0" pr="$1" pb="$2" jc="center">
                <ToggleGroup disableDeactivation={true} height="$3" type="single" value={tab} onValueChange={setTab}>
                    <ToggleGroup.Item value="rules">rules</ToggleGroup.Item>
                    <ToggleGroup.Item value="code">code</ToggleGroup.Item>
                </ToggleGroup>
            </XStack>
            {(tab == 'rules' || !tab) && (
                <YStack flex={1}>
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
                    </YStack>
                </YStack>
            )}

            {tab == 'code' && (
                <YStack flex={1}>
                    <Monaco
                        path={'rules.ts'}
                        darkMode={resolvedTheme === 'dark'}
                        sourceCode={savedCode.current}
                        onChange={(text) => {
                            savedCode.current = text
                        }}
                    />
                    <YStack mt="auto" pt="$3">
                        <Button onPress={() => {
                            boardRef.current.rulesCode = savedCode.current
                            API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)
                        }}>
                            Save Code
                        </Button>
                    </YStack>
                </YStack>
            )}
        </Tinted>
    </YStack>
}