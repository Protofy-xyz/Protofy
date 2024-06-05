import { useState } from "react"
import { Button, Input, Popover, XStack, Spinner } from "tamagui"
import { Folder } from 'lucide-react'
import { Tinted, Center } from 'protolib'
import dynamic from 'next/dynamic'

const FileBrowser = dynamic<any>(() =>
    import('protolib/adminpanel/next/components/FileBrowser').then(module => module.FileBrowser),
    { ssr: false, loading: () => <Tinted><Center><Spinner size='small' color="$color7" scale={4} /></Center></Tinted> }
);

type FilePickerProps = {
    onFileChange?: Function,
    file?: string,
    placeholder?: string
}


export function FilePicker({ onFileChange, file, placeholder }: FilePickerProps) {

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(file)

    const onChange = (val) => {
        if (onFileChange) {
            onFileChange(val)
        } else {
            setValue(val)
        }
    }

    return (
        <Popover size="$5" allowFlip open={open} onOpenChange={setOpen}>
            <XStack>
                <Input
                    placeholder={placeholder ?? "Path or URL"}
                    value={file ?? value}
                    onChangeText={(e) => onChange(e)}
                    size={"$3"}
                    paddingRight={"50px"}
                >
                </Input>
                <Popover.Trigger asChild>
                    <Button
                        position="absolute"
                        size={"$3"}
                        borderTopLeftRadius={"$0"}
                        borderBottomLeftRadius={"$0"}
                        right={"$0"}
                        icon={<Folder fillOpacity={0} color="gray" size={15} />}>
                    </Button>
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Arrow />
                    <FileBrowser
                        onOpenFile={(file) => {
                            setOpen(false)
                            onChange(file.path)
                        }}
                    />
                </Popover.Content>
            </XStack>
        </Popover>
    )
}