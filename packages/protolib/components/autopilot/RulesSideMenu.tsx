
import { API } from 'protobase'
import { YStack, XStack, Button, Spinner, useToastController, useTheme } from '@my/ui'
import { Tinted } from '../../components/Tinted'
import { Rules } from '../../components/autopilot/Rules'
import { Monaco } from '../../components/Monaco'
import { useState, useRef, useMemo, useEffect } from 'react'
import { Panel, PanelGroup } from "react-resizable-panels";
import CustomPanelResizeHandle from '../MainPanel/CustomPanelResizeHandle'
import { useSettingValue } from "../../lib/useSetting";
import { getDefinition, toSourceFile } from 'protonode/dist/lib/code'
import { ArrowFunction } from 'ts-morph';
import { CodeView } from '@extensions/files/intents';
import { ClipboardList, Save, Sparkles } from '@tamagui/lucide-icons'

function generateStateDeclarations(obj) {
    const recurse = (o) => {
        return (
            '{\n' +
            Object.entries(o ?? {})
                .map(([key, val]) => {
                    if (typeof val === 'object' && val !== null) {
                        return `  ${key}: ${recurse(val)};`;
                    } else {
                        return `  ${key}: any;`;
                    }
                })
                .join('\n') +
            '\n}'
        );
    };

    return `declare const states: ${recurse(obj)};`;
}


export const RulesSideMenu = ({ leftIcons = <></>, icons = <></>, automationInfo, boardRef, board, actions, states, resolvedTheme }) => {
    const boardStates = states.boards ? states.boards[board.name] : {}
    const boardActions = actions.boards ? actions.boards[board.name] : {}

    const boardStatesDeclarations = useMemo(() => {
        return generateStateDeclarations(boardStates)
    }, [boardStates]);

    const boardDeclaration = useMemo(() => {
        const possibleNames = Object.keys(boardActions ?? {}).map(name => `"${name}"`).join(' | ')
        return `declare const board: {\n` +
            `  onChange: (params: { name: string, changed: (value: any) => void }) => void;\n` +
            `  execute_action: (params: { name: ${possibleNames}, params?: Record<string, any> }) => Promise<any>;\n` +
            `  id: string;\n` +
            `  log: (...args: any[]) => void;\n` +
            `};` +
            '\n};';
    }, [board.name]);

    const code = useMemo(() => {
        const sourceFile = toSourceFile(automationInfo.code)
        const definition = getDefinition(sourceFile, '"code"')
        if (definition && ArrowFunction.isArrowFunction(definition)) {
            return definition.getBodyText()
        }
        return ''
    }, [automationInfo.code]);


    const savedCode = useRef(code)
    const editedCode = useRef(code)
    const [generatingBoardCode, setGeneratingBoardCode] = useState(false)
    const toast = useToastController()
    const isAIEnabled = useSettingValue('ai.enabled', false);

    const theme = useTheme()
    const flows = useMemo(() => {
        return <CodeView
            onApplyRules={async (rules) => {
                try {
                    boardRef.current.rules = rules
                    const rulesCode = await API.post(`/api/core/v1/autopilot/getBoardCode`, { rules: rules, states: boardStates, actions: actions.boards ? actions.boards[board.name] : {} })
                    if (rulesCode.error || !rulesCode.data?.jsCode) {
                        toast.show(`Error generating board code: ${rulesCode.error}`)
                        return
                    }

                    savedCode.current = rulesCode.data.jsCode
                    editedCode.current = rulesCode.data.jsCode
                    await API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)
                } catch (e) {
                    toast.show(`Error generating board code: ${e.message}`)
                    console.error(e)
                }
            }}
            disableAIPanels={!isAIEnabled}
            defaultMode={isAIEnabled ? 'rules' : 'code'}
            rules={board.rules}
            leftIcons={
                <XStack zIndex={9999} gap="$3" ml="$2">
                    {leftIcons}
                </XStack>
            }
            icons={<XStack zIndex={9999} gap="$3" mr="$2">
                {/* <XStack cursor='pointer' onPress={async () => {
                   
                }} o={0.7} pressStyle={{ opacity: 0.7 }} hoverStyle={{ opacity: 1 }}>
                    <Sparkles size="$1" color="var(--color)" />
                </XStack> */}
                {icons}
                <XStack cursor='pointer' onPress={() => {
                    const sourceFile = toSourceFile(automationInfo.code)
                    const definition = getDefinition(sourceFile, '"code"').getBody()
                    definition.replaceWithText("{\n" + editedCode.current + "\n}");
                    API.post(`/api/core/v1/boards/${board.name}/automation`, { code: sourceFile.getFullText() })
                }} o={0.8} pressStyle={{ opacity: 0.8 }} ml="$5" hoverStyle={{ opacity: 1 }}>
                    <Save size="$1" color="var(--color)" />
                </XStack>
            </XStack>}
            viewPort={{ x: 20, y: window.innerHeight / 8, zoom: 0.8 }}
            onFlowChange={(code) => {
                editedCode.current = code
            }}
            onCodeChange={(code) => {
                editedCode.current = code
            }}
            path={board.name + '.ts'}
            sourceCode={editedCode}
            monacoOnMount={(editor, monaco) => {
                monaco.languages.typescript.typescriptDefaults.addExtraLib(
                    boardDeclaration + "\n" +
                    boardStatesDeclarations,
                    'ts:filename/customTypes.d.ts'
                );
            }}
            monacoOptions={{
                folding: true,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 0,
                lineNumbers: true,
                minimap: { enabled: false }
            }}
        />
    }, [resolvedTheme, board.name, theme, editedCode.current, isAIEnabled]);
    return <YStack w="100%" backgroundColor="transparent" backdropFilter='blur(5px)' borderWidth={2} br="$5" elevation={60} shadowOpacity={0.2} shadowColor={"black"} bw={1} boc="$gray6">
        <Tinted>
            <YStack flex={1} mt="$5" height="100%" alignItems="center" justifyContent="center" borderRadius="$3" >
                {flows}
            </YStack>
        </Tinted>
    </YStack>
}