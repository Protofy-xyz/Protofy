
export const getNodeDataField = (fieldValue, fieldKey = undefined, nodeData = undefined) => {
    if (!fieldKey) return fieldValue

    const prefix = fieldKey.split('-')[0]
    var nodeDataField
    switch (prefix) {
        case 'prop':
            var key = fieldKey.split('-')[1]
            var data = nodeData[fieldKey]
            const kind = data?.kind ?? "StringLiteral"
            nodeDataField = { ...data, key, kind, value: fieldValue }
            break
        default:
            nodeDataField = fieldValue
            break
    }
    return nodeDataField
}

export const getFieldValue = (fieldValue, fieldKey = undefined, nodeData = undefined) => {
    if (!fieldKey) return fieldValue

    const prefix = fieldKey.split('-')[0]
    var value
    switch (prefix) {
        case 'prop':
            value = nodeData[fieldKey]?.value
            break
        default:
            value = fieldValue
            break
    }
    return value
}