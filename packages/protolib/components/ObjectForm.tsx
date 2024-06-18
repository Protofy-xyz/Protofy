import React from "react"
import { EditableObject } from './EditableObject';
import { API, getPendingResult } from '../base';
import { useToastController, Text, YStack } from '@my/ui';
import { z } from "protolib/base";

type Props = {
    elementId?: string,
    model?: any
    mode?: 'add' | 'edit' | 'view' | 'preview',
}

export const ObjectForm = React.forwardRef(({ mode = 'edit', elementId, model, ...props }: Props, ref: any) => {

    const toast = useToastController()

    if (typeof model == "string" || !model || !model?.getApiOptions() || (!elementId && mode != "add")) {
        return <YStack ref={ref} padding="$4" gap="$2">
            <Text fontWeight="bold">
                ObjectForm:
            </Text>
            <Text>
                Model or Element ID is empty.
            </Text>
        </YStack>
    }

    const { name, prefix } = model?.getApiOptions() ?? {}
    const apiUrl = prefix + name

    return <YStack ref={ref}>
        <EditableObject
            objectId={elementId}
            name={name}
            title={""}
            sourceUrl={apiUrl + '/' + elementId}
            numColumns={2}
            mode={mode}
            disableAutoChangeMode={true}
            onSave={async (original, data) => {
                try {
                    if (mode == "add") {
                        const obj = model.load(data)
                        const result = await API.post(apiUrl, obj.create().getData())
                        if (result.isError) {
                            throw result.error
                        }
                        toast.show(name + ' created', {
                            message: obj.getId()
                        })
                    }
                    else if (mode == "edit") {
                        const id = model.load(data).getId()
                        const result = await API.post(apiUrl + '/' + id, model.load(original).update(model.load(data)).getData())
                        if (result.isError) {
                            throw result.error
                        }
                        toast.show(name + ' updated', {
                            message: "Saved new settings for: " + id
                        })
                    }
                } catch (e) {
                    throw getPendingResult('error', null, e instanceof z.ZodError ? e.flatten() : e)
                }
            }}
            model={model}
        />
    </YStack>
})