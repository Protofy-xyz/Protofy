import { Stack, Text, Input, Button, YStack } from '@my/ui';
import { ChonkyIconName } from 'chonky';
import { CopyBubble, NextLink, Center } from 'protolib';
import { API } from '../../base/Api';
import { useState } from 'react';

const CreateComponent = ({ onCreate, buttonText, defaultInput="" }) => {
    const [inputValue, setInputValue] = useState(defaultInput);
    return <>
        <YStack f={1} jc='center' ai='center'>
            <Input width={"300px"} mt={"$7"} value={inputValue} onChange={e => setInputValue(e.target.value)}></Input>
            <Button onPress={() => onCreate(inputValue)} mt={"$6"} width={"150px"}>{buttonText}</Button>
        </YStack>
    </>
}

const fileActions = [
    {
        getComponent: (selected, path) => {
            if (selected.length) {
                const href = document.location.origin + path.slice(17) + '/' + selected[0].name
                return <>
                    <CopyBubble mt={"$10"} text={href} />
                    <Stack mt={"$6"} ml="auto" mr="auto">
                        <NextLink href={href} target='_blank'><Text fontWeight={"600"}>Open link</Text></NextLink>
                    </Stack>
                </>
            }
            return <></>
        },
        title: "Public link",
        // description: "This is a public link to access this file, anyone with de link can access the contect of the file",
        filter: (path, selected) => {
            return path.startsWith("/apps/next/public") && selected.length == 1 && !selected[0].isDir
        },
        size: {
            width: 500,
            height: 200
        },
        action: {
            id: "getPublicLink",
            button: {
                name: "Get link",
                toolbar: true,
                icon: ChonkyIconName.share
                // group: 'link'
            }
        }
    },
    {
        getComponent: (selected, path, setCustomAction, setFiles) => {
            return <CreateComponent 
            buttonText={"Create directory"}
            onCreate={(name) => { API.post('/adminapi/v1/directories/' + path.replace(/\/+/g, '/') + '/' + name, { content: "" }); setCustomAction(false); setFiles() }} />
        },
        title: "Create folder",
        size: {
            width: 500,
            height: 200
        },
        action: {
            id: "makedir",
            button: {
                name: "Create folder",
                toolbar: true,
                icon: ChonkyIconName.folderCreate,
                group: 'Actions'
            }
        }
    },
    {
        getComponent: (selected, path, setCustomAction, setFiles) => {
            return <CreateComponent 
            buttonText={"Create file"}
            onCreate={(name) => { API.post('/adminapi/v1/files/' + path.replace(/\/+/g, '/') + '/' + name, { content: "" }); setCustomAction(false); setFiles() }} />
        },
        title: "Create file",
        size: {
            width: 500,
            height: 200
        },
        action: {
            id: "makefile",
            button: {
                name: "Create file",
                toolbar: true,
                icon: ChonkyIconName.file,
                group: 'Actions'
            }
        }
    }, 
    {
        getComponent: (selected, path, setCustomAction, setFiles) => {
            console.log("PSEEEEEEEEEL", selected)
            return <CreateComponent 
            buttonText={"Rename"}
            defaultInput={selected[0].name}
            onCreate={(name) => { API.post('/adminapi/v1/renameItem', { currentPath: path.replace(/\/+/g, '/')  + '/' + selected[0].name, newName: name }); setCustomAction(false); setFiles() }} />
        },
        title: "Rename",
        filter: (path, selected) => {
            return selected.length == 1
        },
        size: {
            width: 500,
            height: 200
        },
        action: {
            id: "rename",
            button: {
                name: "Rename",
                toolbar: true,
                icon: ChonkyIconName.folderChainSeparator,
                group: 'Actions'
            }
        }
    },

];

export default fileActions;