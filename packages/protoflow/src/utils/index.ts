
export const getNodeDataField = (fieldValue, field = undefined, nodeData = undefined, metadata = {}) => {
    if (!field) return fieldValue

    const prefix = field.split('-')[0]
    const kind = data?.kind ?? metadata['kind'] ?? "StringLiteral"

    var nodeDataField

    switch (prefix) {
        case 'prop':
            var key = field.split('-')[1]
            var data = nodeData[field]
            nodeDataField = { ...data, key, kind, value: fieldValue }
            break
        default:
            nodeDataField = fieldValue
            break
    }
    return nodeDataField
}

export const getFieldValue = (fieldValue, field = undefined, nodeData = undefined) => {
    if (!field) return fieldValue

    const prefix = field.split('-')[0]
    var value
    switch (prefix) {
        case 'prop':
            value = nodeData[field]?.value
            break
        default:
            value = fieldValue
            break
    }
    return value
}