import { YStack, XStack, Label, Input, Switch } from '@my/ui'
import { Monaco } from '../Monaco'

export const SettingsEditor = ({
  card,
  cardData,
  setCardData,
  resolvedTheme,
}: {
  card: any
  cardData: any
  setCardData: (data: any) => void
  resolvedTheme: string
}) => {
  const handleSwitchChange = (key: string) => (value: boolean) => {
    setCardData({ ...cardData, [key]: value })
  }

  return (
    <YStack f={1}>
      {card.type === 'action' && (
        <XStack flexWrap="wrap" gap="$4">
          <XStack ai="center">
            <Label htmlFor="display-title-switch" mr="$3">Display title</Label>
            <Switch
              id="display-title-switch"
              size="$4"
              checked={cardData.displayTitle ?? true}
              onCheckedChange={handleSwitchChange('displayTitle')}
              className="no-drag"
            >
              <Switch.Thumb className="no-drag" animation="quick" />
            </Switch>
          </XStack>

          <XStack ai="center">
            <Label htmlFor="display-value-switch" mr="$3">Display value</Label>
            <Switch
              id="display-value-switch"
              size="$4"
              checked={cardData.displayResponse ?? true}
              onCheckedChange={handleSwitchChange('displayResponse')}
              className="no-drag"
            >
              <Switch.Thumb className="no-drag" animation="quick" />
            </Switch>
          </XStack>

          <XStack ai="center">
            <Label htmlFor="display-icon-switch" mr="$3">Display icon</Label>
            <Switch
              id="display-icon-switch"
              size="$4"
              checked={cardData.displayIcon ?? true}
              onCheckedChange={handleSwitchChange('displayIcon')}
              className="no-drag"
            >
              <Switch.Thumb className="no-drag" animation="quick" />
            </Switch>
          </XStack>

          <XStack ai="center">
            <Label htmlFor="display-button-switch" mr="$3">Display button</Label>
            <Switch
              id="display-button-switch"
              size="$4"
              checked={cardData.displayButton ?? true}
              onCheckedChange={handleSwitchChange('displayButton')}
              className="no-drag"
            >
              <Switch.Thumb className="no-drag" animation="quick" />
            </Switch>
          </XStack>

          {(cardData.displayButton ?? true) && (
            <XStack ai="center">
              <Label htmlFor="button-text-input" mr="$2">Button text</Label>
              <Input
                outlineColor="$colorTransparent"
                id="button-text-input"
                size="$4"
                placeholder="Button text"
                value={cardData.buttonLabel ?? 'Run'}
                onChangeText={(value) => {
                  setCardData({ ...cardData, buttonLabel: value })
                }}
                className="no-drag"
              />
            </XStack>
          )}
        </XStack>
      )}

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
    </YStack>
  )
}
