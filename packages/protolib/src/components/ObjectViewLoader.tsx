
import { getPendingResult, API } from 'protobase'
import { usePendingEffect } from '../lib/usePendingEffect';
import { useState } from 'react';
import { AsyncView } from './AsyncView';

export const ObjectViewLoader = (props) => {
    const objectUrl = `/api/core/v1/objects/${props.object}`
    const [data, setData] = useState(props.objectData ?? getPendingResult('pending'))
    usePendingEffect((s) => { API.get({ url: objectUrl }, s) }, setData, props.objectData)
    return <AsyncView atom={data} >
        <props.widget
            {...props}
            object={data.isLoaded ? data.data : {}}
        >{props.children}</props.widget>
    </AsyncView>
}