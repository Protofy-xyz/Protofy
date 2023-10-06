import { XStack } from "@my/ui"
import { BlockTitle } from "protolib"
import { NoteType } from "../notesSchemas"
import { NoteModel } from "../notesModels"

export const NoteView = ({data}:{data: NoteType}) => {
    const note = NoteModel.load(data)
    return <XStack f={1} mb={"$5"} ml="$5" jc="center" ai="center">
        <BlockTitle title={note.getId()}></BlockTitle>
    </XStack>
}