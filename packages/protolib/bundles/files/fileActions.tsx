import { Stack, Text, Input, Button, YStack } from '@my/ui';
import { ChonkyIconName } from 'chonky';
import { CopyBubble, NextLink, Center } from 'protolib';
import { API } from '../../lib/Api';
import { useState } from 'react';

const CreateComponent = ({onCreate}) => {
    const [inputValue, setInputValue] = useState('');
    return <>
        <YStack f={1} jc='center' ai='center'>
            <Input width={"300px"} mt={"$7"} value={inputValue} onChange={e => setInputValue(e.target.value)}></Input>
            <Button onPress={() => onCreate(inputValue)} mt={"$6"} width={"150px"}>Create</Button>
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
        getComponent: (selected, path) => {
            return <CreateComponent onCreate={(name)=>{API.post('/adminapi/v1/directories/'+path.replace(/\/+/g, '/')+'/'+name, {content:""})}} />
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
                icon: ChonkyIconName.folder,
                group: 'Actions'
            }
        }
    },
    {
        getComponent: (selected, path) => {
            return <CreateComponent onCreate={(name)=>{API.post('/adminapi/v1/files/'+path.replace(/\/+/g, '/')+'/'+name, {content:""})}} />
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
    }

];

export default fileActions;