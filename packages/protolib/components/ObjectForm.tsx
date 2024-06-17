import { YStack } from 'tamagui'
import React from "react"
import { EditableObject } from './EditableObject';
import { API, getPendingResult } from '../base';
import { useToastController } from '@my/ui';
import { z } from "protolib/base";

type Props = {
    elementId?: string,
    model: any
    mode?: 'add' | 'edit' | 'view' | 'preview',
}

export const ObjectForm = React.forwardRef(({ mode = 'edit', elementId, model, ...props }: Props, ref: any) => {

    const { name, prefix } = model.getApiOptions()
    const apiUrl = prefix + name

    const toast = useToastController()

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