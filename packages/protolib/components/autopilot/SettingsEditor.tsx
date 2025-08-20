import { YStack, XStack, Label, Input, Checkbox } from '@my/ui'
import { Check } from 'lucide-react'
import { Monaco } from '../Monaco'
import { v4 as uuidv4 } from 'uuid';

export const SettingsEditor = ({
    cardData,
    setCardData,
    resolvedTheme,
}: {
    cardData: any
    setCardData: (data: any) => void
    resolvedTheme: string
}) => {

    return (
        <XStack f={1} gap="$4">
            <Monaco
                path={`card-${cardData.name}.ts`}
                darkMode={resolvedTheme === 'dark'}
                sourceCode={JSON.stringify(cardData, null, 2)}
                onChange={(newCode) => {
                    try {
                        setCardData(JSON.parse(newCode))
                    } catch (err) {
                        console.error('Invalid JSON', err)
                    }
                }}
                options={{
                    scrollBeyondLastLine: false,
                    scrollbar: { vertical: 'auto', horizontal: 'auto' },
                    folding: false,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 0,
                    minimap: { enabled: false },
                    formatOnPaste: true,
                    formatOnType: true,
                }}
            />
        </XStack>
    )
}
