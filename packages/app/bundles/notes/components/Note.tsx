import { Paragraph, YStack } from "@my/ui"
import { BlockTitle } from "protolib"
import { NoteType } from "../notesSchemas"
import { NoteModel } from "../notesModels"

export const Note = ({data}:{data: NoteType}) => {
    const note = NoteModel.load(data) as NoteModel
    return <YStack f={1} mb={"$5"} ml="$5" jc="center" ai="center">
        <BlockTitle title={note.getId()} subtitle={data.title}>dd</BlockTitle>
        <Paragraph>{data.body}</Paragraph>
    </YStack>
}