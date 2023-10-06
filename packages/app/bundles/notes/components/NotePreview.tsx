
import { H2, H4, YStack } from "@my/ui"
import { ItemCard, Link} from "protolib"
import { NoteModel } from "../notesModels"
import { NoteType } from "../notesSchemas"

export const NotePreview = ({data}:{data: NoteType}) => {
    return <YStack minHeight={"$8"} f={1} ai="center" jc="center">
        <Link href={"/notes/"+data.id}>
            <H4>{data.id}</H4>
        </Link>
    </YStack>
}