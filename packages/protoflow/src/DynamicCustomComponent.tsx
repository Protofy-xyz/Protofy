import React, { useCallback, useMemo, useEffect, useRef, useState, useContext } from 'react';
import Node, { Field, FlowPort, NodeParams } from './Node';
import { MdOutlineComment } from "react-icons/md";
import { filterCallback, restoreCallback, filterCallbackProp, restoreCallbackProp } from "./lib/Mask";
import FallbackPort from './FallbackPort';
import AddPropButton from './AddPropButton';
import dynamicMasks from './dynamicMasks';
import DynamicMask from './dynamicMasks/DynamicMask';

const globalObj = {
    filterCallback,
    restoreCallback,
    filterCallbackProp,
    restoreCallbackProp
}

interface DynamicCustomComponentDefinition {
    id: string,
    title: string,
    path: string,
    type: string,
    filter: {
        "to": string,
        "params": string[]
    },
    body: {
        modules: [{}]
    },
    initialData: {
        to: string
    },
    filterChildren: string,
    restoreChildren: string
}

const compute = (str) => {
    //console.log('evaluating: ', str);
    const result = new Function(str)?.call(globalObj);
    //console.log('result: ', result)
    return result
}

const GetDynamicCustomComponent = (data: DynamicCustomComponentDefinition) => {
    const obj: any = {
        data: data,
        id: data.id,
        type: data.type,
        check: (node, nodeData) => (dynamicMasks[data.type] ?? DynamicMask).check(node, nodeData, data),
        getComponent: dynamicMasks[data.type] ?? DynamicMask,
        getInitialData: () => data.initialData,
    }
    if (data.filterChildren) {
        obj.filterChildren = compute(data.filterChildren)
    }

    if (data.restoreChildren) {
        obj.restoreChildren = compute(data.restoreChildren)
    }
    return obj
}

export default GetDynamicCustomComponent