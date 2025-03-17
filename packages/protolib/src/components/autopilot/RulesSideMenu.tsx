
import { API } from 'protobase'
import { YStack, XStack, ToggleGroup, Button, Spinner } from '@my/ui'
import { Tinted } from '../../components/Tinted'
import { Rules } from '../../components/autopilot/Rules'
import { Monaco } from '../../components/Monaco'
import { useState } from 'react'
import { useThemeSetting } from '@tamagui/next-theme'


export const RulesSideMenu = ({boardRef, board}) => {
    const [tab, setTab] = useState("rules");
    const { resolvedTheme } = useThemeSetting();
    const [savedRules, setSavedRules] = useState(board.rules)
    const [savedCode, setSavedCode] = useState(board.rulesCode)
    const [generatingBoardCode, setGeneratingBoardCode] = useState(false)

    return <YStack height="90%" w="600px" backgroundColor="$bgPanel" p="$3" btlr={9} bblr={9}>
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
                        loadingIndex={-1}
                    />
                    <YStack mt="auto" pt="$3">
                        <Button onPress={async () => {
                            setGeneratingBoardCode(true)
                            try {
                                boardRef.current.rules = savedRules
                                const rulesCode = await API.post(`/api/core/v1/autopilot/getBoardCode`, { rules: savedRules, states: states.boards[board.name], actions: actions.boards[board.name] })
                                if (rulesCode.status == 'loaded') {
                                    setSavedCode(rulesCode.data.jsCode)
                                }
                                boardRef.current.rulesCode = savedCode
                                await API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)

                                // boardRef.current.rules = []
                                // await API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)
                            } catch (e) {
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
                        sourceCode={boardRef.current?.rulesCode}
                        onChange={(text) => {
                            setSavedCode(text)
                        }}
                    />
                    <YStack mt="auto" pt="$3">
                        <Button onPress={() => {
                            boardRef.current.rulesCode = savedCode
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