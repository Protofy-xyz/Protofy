import { Type, Hash, ToggleLeft, Braces, Code } from 'lucide-react'

const types = {
    "string": ["StringLiteral"],
    "number": ["NumericLiteral"],
    "boolean": ["FalseKeyword", "TrueKeyword"],
    "object": ["ObjectLiteralExpression"],
    "code": ["Identifier", "NullKeyword", "PropertyAccessExpression"],
}

const getKindByType = (type) => {
    return types[type][0]
}

export const getTypeByKind = (kind) => {
    return Object.keys(types).find(t => types[t].includes(kind))
}


export const getNextKind = (currentKind) => {
    var currentType = getTypeByKind(currentKind)
    var nextTypeIndex = Object.keys(types).indexOf(currentType) + 1
    var length = (Object.keys(types).length - 1)
    var nextPos = nextTypeIndex % length

    var nextType = Object.keys(types)[nextPos]
    return getKindByType(nextType)
}


export const getKindIcon = (kind) => {
    const type = getTypeByKind(kind)
    switch (type) {
        case "string":
            return Type

        case "number":
            return Hash

        case "boolean":
            return ToggleLeft

        case "object":
            return Braces

        case "code":
            return Code

        default:
            return
    }
}