import { Type, Hash, ToggleLeft, Braces, Code } from 'lucide-react'

const types = {
    "string": {
        "StringLiteral": {
            get: node => node?.getLiteralValue(),
            dump: value => '"' + value + '"'
        }
    },
    "number": {
        "NumericLiteral": {
            get: node => node?.getLiteralValue(),
            // dump: () => { }
        }
    },
    "boolean": {
        "FalseKeyword": {
            get: node => node?.getLiteralValue(),
            // dump: () => { }
        },
        "TrueKeyword": {
            get: node => node?.getLiteralValue(),
            // dump: () => { }
        }

    },
    // "object": {
    //     "ObjectLiteralExpression": {
    //         get: () => { },
    //         dump: () => { }
    //     }
    // },
    "code": {
        "Identifier": {
            get: node => node.getText(),
            // dump: () => { }
        },
        "NullKeyword": {
            get: node => node.getText(),
            // dump: () => { }
        },
        "PropertyAccessExpression": {
            get: node => node.getText(),
            // dump: () => { }
        }
    },
}

const typeKinds = Object.values(types).reduce((acc, curr) => {
    return Object.assign(acc, curr);
}, {});

const getKindByType = (type) => {
    return Object.keys(types[type])[0]
}

export const getTypeByKind = (kind) => {
    return Object.keys(types).find(t => Object.keys(types[t]).includes(kind))
}

export const getArgumentsData = (node): any => {
    var kind = node?.getKindName()
    var typeKind = typeKinds[kind]
    var value

    if (typeKind) {
        value = typeKind.get(node)
        return { kind, value }
    } else {
        return
    }
}
export const dumpArgumentsData = (data: { kind: string, value: any }) => {
    if (!data) return

    var kind = data.kind
    var typeKind = typeKinds[kind]
    var value = data.value

    if (typeKind && typeKind.dump) {
        return typeKind.dump(value)
    }

    return String(value)
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