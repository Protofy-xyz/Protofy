import { GitMerge } from '@tamagui/lucide-icons'
import { Button, Input, XStack, YStack } from "@my/ui"
import { useEffect, useState } from "react"
import { API } from 'protobase'
import { Monaco } from "../Monaco";
import { useThemeSetting } from '@tamagui/next-theme';
import Icon from "components/Icon";
import { FadeLoader, PulseLoader } from 'react-spinners';

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
  }


  return <YStack width={"500px"} height={"100%"} borderRadius="$3" gap="$2">
    <XStack gap="$2">
      <Input placeholder='table component with two rows and two columns' w="100%"
        onChange={(e) => setQuery(e.target?.value)}
        value={query}
      />
      <Button
        onPress={() => getRulesCode()}
      >
        Generate
      </Button>
    </XStack>
    <YStack flex={1} jc="center" ai="center" >
      {
        loading
          ? <PulseLoader
            color='#ececec'
          />
          : <YStack
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
    <Button
      onPress={() => setHTMLCode(aiComponent)}
    >
      <GitMerge size={"$1"} />
      merge changes
    </Button>
  </YStack >
}