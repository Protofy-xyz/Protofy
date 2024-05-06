import React, { useEffect } from "react"
import InputFields from "../../fields/InputFields"

export const ApiType = ({ element, mask, node, nodeData }) => {
    // TODO: Refactor api type
    const [res, setRes] = React.useState()
    const ele = mask.data.body.find(e => e.type == 'api')
    const resListFunction = new Function('res', element.data?.list)
    const selectorListFunction = new Function('data', "return data?." + element.data?.selector)
    const tmpRes = element?.data?.selector && res ? selectorListFunction(res) : res

    const apiList = tmpRes?.map(resListFunction)?.filter(e => e) ?? []
    const field = element.data.field

    useEffect(() => {
        const apiUrl = ele.data.apiUrl
        fetch(apiUrl).then(response => response.json())
            .then(data => {
                setRes(data)
            })
    }, [])

    return <>
        <InputFields
            node={node}
            nodeData={nodeData}
            item={{
                field,
                label: element.data.label,
                type: 'input',
                data: {
                    options: apiList
                }
            }}
        />
    </>

}