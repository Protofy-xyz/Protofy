import { useState } from "react"
import { Button, Input, XStack, Spinner, Dialog, Text } from "tamagui"
import { Folder } from 'lucide-react'
import { Tinted, Center } from 'protolib'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';

const FileBrowser = dynamic<any>(() =>
    import('protolib/adminpanel/next/components/FileBrowser').then(module => module.FileBrowser),
    { ssr: false, loading: () => <Tinted><Center><Spinner size='small' color="$color7" scale={4} /></Center></Tinted> }
);

type FilePickerProps = {
    onFileChange?: Function,
    file?: string,
    placeholder?: string
    initialPath?: string
}


export function FilePicker({ onFileChange, file, placeholder, initialPath = "" }: FilePickerProps) {
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(file ?? initialPath)

    const [tmpFile, setTmpFile] = useState(file ?? initialPath)

    const fileIsUrl = file?.startsWith('http')

    const onChange = (val) => {
        if (onFileChange) {
            onFileChange(val)
        } else {
            setValue(val)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <XStack>
                <Input
                    placeholder={placeholder ?? "Path or URL"}
                    value={file ?? value}
                    onChangeText={(e) => onChange(e)}
                    size={"$3"}
                    f={1}
                    paddingRight={"50px"}
                >
                </Input>
                <Dialog.Trigger >
                    <Button
                        position="absolute"
                        size={"$3"}
                        borderColor={"$color6"}
                        borderTopLeftRadius={"$0"}
                        borderBottomLeftRadius={"$0"}
                        right={"$0"}
                        onPress={() => {
                            if (!fileIsUrl) {
                                const dirPath = file ? file.split('/').slice(0, -1).join('/') : initialPath
                                router.replace({
                                    query: { ...router.query, path: dirPath },
                                });
                            }
                            setOpen(!open)
                        }}
                        icon={<Folder fillOpacity={0} color="gray" size={15} />}>
                    </Button>
                </Dialog.Trigger>
            </XStack>
            <Dialog.Portal>
                <Dialog.Content height={"80vh"} width={"80vw"} padding="$6">
                    <Tinted>
                        <Text fontWeight="bold" fontSize={30} color={"$color8"}>File Browser</Text>
                        <Text marginBottom="$4"> Selected file: <Text color={"$color7"} fontStyle="italic">{tmpFile}</Text></Text>
                    </Tinted>
                    <FileBrowser
                        onOpenFile={(file) => {
                            setOpen(false)
                            onChange(file.path)
                        }}
                        onChangeSelection={(f) => {
                            const pathFile = f[0]?.path
                            if (pathFile) {
                                setTmpFile(pathFile)
                            }
                        }}
                        selection={tmpFile}
                    />
                    <XStack gap="$4" justifyContent="center" alignSelf="center" width={"100%"} maxWidth={"500px"}>
                        <Tinted>
                            <Button
                                f={1}
                                onPress={() => setOpen(false)}
                                backgroundColor={"transparent"}
                                borderWidth={2}
                                borderColor="$color6"
                                hoverStyle={{
                                    backgroundColor: "$color2",
                                    borderColor: "$color6",
                                    borderWidth: 2
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                f={1}
                                onPress={() => {
                                    setOpen(false)
                                    onChange(tmpFile)
                                }}>
                                Accept
                            </Button>
                        </Tinted>
                    </XStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    )
}