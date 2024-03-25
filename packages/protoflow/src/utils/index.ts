
export const getDataFromField = (fieldValue, field = undefined, nodeData = undefined, metadata = {}) => {
    if (!field) return fieldValue

    const prefix = field.split('-')[0]
    const kind = data?.kind ?? metadata['kind'] ?? "StringLiteral"

    var nodeDataField

    switch (prefix) {
        case 'prop':
        case 'param':
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

export const getFieldValue = (field, nodeData) => {

    const prefix = field.split('-')[0]
    var value

    switch (prefix) {
        case 'prop':
        case 'param':
            value = nodeData[field]?.value
            break
        default:
            value = nodeData[field]
            break
    }
    return value
}