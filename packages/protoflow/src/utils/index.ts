export const getFieldType = (field): 'detailed' | 'literal' => {
    const prefix = field.split('-')[0]
    var type

    switch (prefix) {
        case 'prop':
        case 'param':
            type = 'detailed' // e.g: field: { value: "20px", key: "fieldKey", kind: "StringLiteral", ... }
            break
        default:
            type = 'literal' // e.g: field: "20px"
            break
    }
    return type
}

export const getDataFromField = (fieldValue, field = undefined, nodeData = undefined, metadata = {}) => {
    if (!field) return fieldValue

    const prefix = field.split('-')[0]
    const type = getFieldType(prefix)
    const kind = data?.kind ?? metadata['kind'] ?? "StringLiteral"

    var nodeDataField

    switch (type) {
        case 'detailed':
            var data = nodeData[field]
            var key = data.key ?? field.split('-')[1]
            nodeDataField = { ...data, key, kind, value: fieldValue }
            break
        case 'literal':
        default:
            nodeDataField = fieldValue
            break
    }
    return nodeDataField
}

export const getFieldValue = (field, nodeData) => {

    const prefix = field.split('-')[0]
    const type = getFieldType(prefix)

    var value

    switch (type) {
        case 'detailed':
            value = nodeData[field]?.value
            break
        case 'literal':
        default:
            value = nodeData[field]
            break
    }
    return value
}