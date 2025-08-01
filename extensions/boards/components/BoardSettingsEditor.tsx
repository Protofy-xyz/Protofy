import { YStack, Text, Input, H3, XStack, Switch, Button, Spinner, Checkbox } from "@my/ui"
import { AlertDialog } from "protolib/components/AlertDialog"
import { SelectList } from "protolib/components/SelectList"
import { Tinted } from "protolib/components/Tinted"
import { useState } from "react"
import { Check } from "@tamagui/lucide-icons"

const columnWidth = 170
const ColumnTitle = ({ children }) => <Text
    w={columnWidth}
    fos="$4"
>
    {children}
</Text>

const ColInput = ({ ...props }) => <Input
    backgroundColor="$gray3"
    borderWidth={0}
    outlineColor={"$gray8"}
    placeholderTextColor="$gray9"
    {...props}
/>

export const BoardSettingsEditor = ({ settings, open, setOpen, onSave, errors }) => {

    const [currentSettings, setCurrentSettings] = useState(settings)
    const [loading, setLoading] = useState(false)

    const clearSettings = (stt) => {
        const cleaned = { ...stt }
        if (cleaned.margin) {
            if (!Array.isArray(cleaned.margin) || cleaned.margin.length !== 2 || cleaned.margin.every(m => m == "")) {
                delete cleaned.margin
            }
            else {
                cleaned.margin = cleaned.margin.map(m => m.length ? parseInt(m) : 0)
            }
        }
        if (cleaned.backgroundImage?.trim() === "") {
            delete cleaned.backgroundImage
        }
        if (cleaned.compactType === "default" || !cleaned.compactType) {
            delete cleaned.compactType
        }
        if (Object.keys(cleaned).includes("allowOverlap")) {
            if ((cleaned.allowOverlap != true && cleaned.allowOverlap != false)) {
                delete cleaned.allowOverlap
            }
        }
        return cleaned
    }

    const onSaveSettigns = async () => {
        setLoading(true)
        let cleanedSettings = clearSettings(currentSettings)
        await onSave(cleanedSettings)
        setLoading(false)
        setOpen(false)
    }

    return <AlertDialog
        integratedChat
        p={"$6"}
        // pt="$5"
        // pl="$5"
        setOpen={setOpen}
        open={open}
        hideAccept={true}
        description={""}
        w="96%"
        maw="500px"
    >
        <YStack gap="$6" f={1}>
            <Tinted>
                <H3 color="$color8">Board Settings</H3>
            </Tinted>
            <YStack gap="$4" f={1}>
                <XStack alignItems="center">
                    <ColumnTitle>Background Image URL</ColumnTitle>
                    <ColInput
                        f={1}
                        placeholder="URL or path to background image"
                        value={currentSettings?.backgroundImage}
                        onChangeText={(text) => setCurrentSettings({ ...currentSettings, backgroundImage: text })}
                    />
                </XStack>
                <XStack alignItems="center">
                    <ColumnTitle>Autoplay</ColumnTitle>
                    <Checkbox
                        w="$2"
                        h="$2"
                        focusStyle={{ outlineWidth: 0 }}
                        checked={currentSettings?.autoplay ?? false}
                        onCheckedChange={(checked) => setCurrentSettings({ ...currentSettings, autoplay: checked })}
                        className="no-drag"
                    >
                        <Checkbox.Indicator>
                            <Check size={16} />
                        </Checkbox.Indicator>
                    </Checkbox>
                </XStack>
                <XStack alignItems="center">
                    <ColumnTitle>Show board UI on play</ColumnTitle>
                    <Checkbox
                        w="$2"
                        h="$2"
                        focusStyle={{ outlineWidth: 0 }}
                        checked={currentSettings?.showBoardUIOnPlay ?? false}
                        onCheckedChange={(checked) => setCurrentSettings({ ...currentSettings, showBoardUIOnPlay: checked })}
                        className="no-drag"
                    >
                        <Checkbox.Indicator>
                            <Check size={16} />
                        </Checkbox.Indicator>
                    </Checkbox>
                </XStack>
                <XStack alignItems="center">
                    <ColumnTitle>{"Margin"}</ColumnTitle>
                    <ColInput
                        w={60}
                        mr="$2"
                        maxLength={3}
                        placeholder="X"
                        value={currentSettings?.margin?.[0]?.toString() || ""}
                        onChangeText={(text) => setCurrentSettings({ ...currentSettings, margin: [text != "" && !isNaN(parseInt(text)) ? parseInt(text).toString() : "", currentSettings?.margin?.[1] || ""] })}
                    />
                    <ColInput
                        w={60}
                        maxLength={3}
                        placeholder="Y"
                        value={currentSettings?.margin?.[1]?.toString() || ""}
                        onChangeText={(text) => setCurrentSettings({ ...currentSettings, margin: [currentSettings?.margin?.[0] || "", text != "" && !isNaN(parseInt(text)) ? parseInt(text).toString() : ""] })}
                    />
                </XStack>
                <XStack alignItems="center">
                    <ColumnTitle>Overlap</ColumnTitle>
                    <YStack w={127}>
                        <SelectList
                            triggerProps={{ backgroundColor: "$gray3", borderWidth: 0 }}
                            title={"Overlap"}
                            value={currentSettings?.allowOverlap == true ? "yes" : currentSettings?.allowOverlap == false ? "no" : "default"}
                            elements={[{ value: "default", caption: "default" }, { value: true, caption: "yes" }, { value: false, caption: "no" }]}
                            setValue={(value) => setCurrentSettings({ ...currentSettings, allowOverlap: value })}
                        />
                    </YStack>
                </XStack>
                <XStack alignItems="center">
                    <ColumnTitle>{"Compact type"}</ColumnTitle>
                    <YStack w={127}>
                        <SelectList
                            triggerProps={{ backgroundColor: "$gray3", borderWidth: 0 }}
                            title={"Compact Type"}
                            value={currentSettings?.compactType || "default"}
                            placeholder="Select compact type"
                            elements={[{ value: "default", caption: "default" }, { value: "vertical", caption: "vertical" }, { value: "horizontal", caption: "horizontal" }]}
                            setValue={(value) => setCurrentSettings({ ...currentSettings, compactType: value })}
                        />
                    </YStack>
                </XStack>
            </YStack>
            <Tinted>
                <Button
                    onPress={onSaveSettigns}
                >
                    Save
                    {loading && <Spinner />}
                </Button>
            </Tinted>
        </YStack>
    </AlertDialog>
}