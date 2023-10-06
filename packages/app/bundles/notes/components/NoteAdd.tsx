import { Fieldset, Input, Label, YStack } from "@my/ui"
import { BaseNoteSchema } from "../notesSchemas"
export const NoteAdd = () => {
    const fields = Object.keys(BaseNoteSchema.shape).map(p => {
        return {name: p}
    })
    return <YStack width={"100%"} f={1}>
        {fields.map(f => <Fieldset my={"$2"} gap="$4" horizontal>
            <Label width={"120px"}>{f.name}</Label>
            <Input f={1}></Input>
        </Fieldset>)}
    </YStack>
}