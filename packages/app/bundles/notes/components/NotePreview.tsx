
import { YStack } from "@my/ui"
import { ItemCard, Link} from "protolib"
import { NoteModel } from "../notesModels"
import { NoteType } from "../notesSchemas"

export const NotePreview = ({data}:{data: NoteType}) => {
    return <YStack minHeight={"$8"} f={1} ai="center" jc="center">
        <Link href={"/notes/"+data.id}>
            {data.id}
        </Link>
    </YStack>
}