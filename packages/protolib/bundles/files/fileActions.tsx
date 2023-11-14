import { Stack, Text } from '@my/ui';
import { ChonkyIconName } from 'chonky';
import { CopyBubble, NextLink, Center } from 'protolib';

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
    }
];

export default fileActions;