import { GitMerge } from '@tamagui/lucide-icons'
import { Button, TextArea, XStack, YStack } from "@my/ui"
import { useState } from "react"
import { API } from 'protobase'
import { Monaco } from "../Monaco";
import { useThemeSetting } from '@tamagui/next-theme';
import { Tinted } from "../Tinted";
import { PulseLoader } from 'react-spinners';
import { ArrowUp, X } from '@tamagui/lucide-icons'

export const ComponentCodeGeneration = ({ htmlCode, setHTMLCode }) => {
  const [loading, setLoading] = useState(false)
  const [aiComponent, setAiComponent] = useState(false)
  const [query, setQuery] = useState("")
  const { resolvedTheme } = useThemeSetting();

  const getRulesCode = async (force?) => {
    setLoading(true)
    const code = await API.post('/api/core/v1/autopilot/getComponent' + '?debug=true', { sourceComponent: htmlCode, request: query })
    if (!code?.data?.jsCode) return
    setLoading(false)
    setAiComponent(code.data.jsCode)
    setQuery("")
  }

  const onAccept = async () => {
    setHTMLCode(aiComponent)
    setAiComponent(false)
  }

  return <YStack width={"100%"} height={"100%"} borderRadius="$3">
    {!aiComponent && <YStack gap="$1" p="$1">
      <TextArea
        w="100%"
        placeholder="Describe the changes you want in your component..."
        value={query}
        onChangeText={setQuery}                // funciona en web y native
        bc="$gray2"
        borderColor="$gray3"
        br="$4"
        placeholderTextColor="$gray9"
        pr="$10"
        rows={8}
        outlineColor="transparent"
        onKeyPress={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            getRulesCode()
          }
        }}
      />
      <Button
        themeInverse={!!query}
        disabled={!query}
        onPress={() => getRulesCode()}
        iconAfter={ArrowUp}
        circular
        size="$3"
        bc="$gray1"
        boc="$gray6"
        hoverStyle={{ backgroundColor: "$gray1" }}
        pressStyle={{ backgroundColor: "$gray1" }}
        als="center"
        scaleIcon={1.2}
        pos="absolute"
        b="$2.5"
        r="$2.5"
      />
    </YStack>}
    <YStack flex={1} jc="center" ai="center" >
      {
        loading && <PulseLoader
          color='#ececec'
        />
      }
      {
        !loading && aiComponent && <YStack
          flex={1}
          height="100%"
          width="100%"
          alignItems="center"
          justifyContent="center"
          backgroundColor="$gray3"
          borderRadius="$3"
          p="$3"
        >
          <Monaco
            sourceCode={aiComponent || "// type into the input to generate a new version"}
            path={'aiComponent.ts'}
            darkMode={resolvedTheme === 'dark'}
            onChange={(code) => setAiComponent(code)}
            options={{
              folding: false,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 0,
              lineNumbers: false,
              minimap: { enabled: false }
            }}
          />
        </YStack>
      }
    </YStack>
    {
      aiComponent && <XStack gap="$4" jc="center" p="$2">
        <Tinted>
          <Button
            onPress={() => setAiComponent(false)}
            w="120px"
            icon={X}
            backgroundColor="$gray3"
            hoverStyle={{backgroundColor: "$gray4"}}
            pressStyle={{backgroundColor: "$gray5"}}
          >
            Cancel
          </Button>
        </Tinted>
        <Button
          onPress={onAccept}
          icon={GitMerge}
          w="120px"
        >
          Accept
        </Button>
      </XStack>
    }
  </YStack >
}