import { UIFLOWID } from "../components/UIEditor";
import { Project, IndentationText, ScriptTarget, ScriptKind, LanguageVariant } from "ts-morph";

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export const getWrapperBorder = (currentNodeId, nodeId, mode) => {
    if (currentNodeId == nodeId && mode == 'editor') {
        return { border: '2px dotted black' }
    } else return {}
}
export const getEmptyBoxStyle = (children: boolean) => {
    if (!children) {
        return { border: '1px dotted blue' }
    } else return {}
}
export const colorsOrder = ['primary', 'secondary', 'tertiary', 'light', 'success', 'error']

export function toNumber(str: string) {
    return isNaN(Number(str)) ? `${str}` : Number(str)
}
export const typeTranslator = {
    "boolean": "toggle",
    "string": "text",
    "number": "number",
    "object": "object"
}
export const translateIcon = {
    "boolean": "checkbox-outline",
    "string": "format-text",
    "number": "numeric-3",
    "object": "code-json"
}

export const types = {
    StringLiteral: {
        icon: "format-text",
        type: "StringLiteral"
    },
    JsxExpression: {
        icon: "code-json",
        type: "JsxExpression"
    }
}

export const dumpValue = (value: string, type: "JsxExpression" | "StringLiteral") => {
    if (type == "JsxExpression") value = "{" + value + "}"
    return value
}

export const loadValue = (value, type: "JsxExpression" | "StringLiteral") => {
    value = value?.toString()
    if (value === undefined) return value
    return type == "JsxExpression" ?
        value.replace(/^\{|\}$/g, "").trim()
        : value.replace(/\s+/g, ' '); // Deletes multiple spaces
}

export function JSCodeToOBJ(jsCode) {
    const fn = new Function('return ' + jsCode + ';')
    return fn()
}

export const dumpComponentProps = (props, custom) => {
    return Object.keys(props)
        .reduce((newProps, propName) => {
            if (!custom[propName]) return newProps //If has no custom on dump component its wrong, so skip this prop
            let newProp = loadValue(props[propName], custom[propName])
            try {
                newProp = JSON.parse(newProp)
            } catch (e) { // For objects without doublequotes
                try {
                    // console.log('gonna evaluate: ', newProp)
                    newProp = JSCodeToOBJ(newProp)
                    // console.log('JString: ', newProp)
                } catch (e) {
                    console.log('Error: ', e)
                }
            }
            return ({
                ...newProps,
                [propName]: newProp
            })
        }, {})
}

export const notify = (topicParams: Object, publish: any, cb?: Function) => {
    publish(UIFLOWID + '/ui', topicParams)
    if (cb) {
        cb()
    }
}

export function computePreviousPositions(oldArray, newArray) {
    /*
        This function returns the index position changes:
        Having:
            const oldArray = ['id1', 'id2', 'id3', '8'];
            const newArray = ['8', 'id3', 'id1', 'id2'];
        The output is:
            [ 3, 2, 0, 1 ]
    */
    const previousPositions = [];
    const indexMap = {};
    for (let i = 0; i < oldArray.length; i++) {
        indexMap[oldArray[i]] = i;
    }
    for (let i = 0; i < newArray.length; i++) {
        const item = newArray[i];
        previousPositions.push(indexMap[item]);
    }
    return previousPositions;
}

export const getSource = (sourceCode, filename = "customCode.tsx") => {
    const project = new Project({
        useInMemoryFileSystem: true,
        manipulationSettings: { indentationText: IndentationText.Tab },
        compilerOptions: {
            target: ScriptTarget.Latest,
            scriptKind: ScriptKind.TSX,
            languageVariant: LanguageVariant.JSX
        },
    })
    const source = project.createSourceFile(filename, sourceCode, { overwrite: true })
    return source
}

export const getMissingJsxImports = (nodes: any, nodeData: any, resolveComponentsDir: any) => {
    const importNodeIds: string[] = nodes.filter(n => n.type == 'ImportDeclaration')?.map(n => n.id)
    const jsxNodeIds: string[] = nodes.filter(n => ["JsxElement", "JsxSelfClosingElement"].includes(n.type))?.map(n => n.id)
    const currentImports = []
    importNodeIds.forEach(nId => {
        const importData = nodeData[nId];
        const module = importData.module;
        Object.keys(importData).forEach(key => {
            let data
            if (key == 'default' && importData[key]) {
                data = {
                    defaultImport: importData["default"],
                    moduleSpecifier: module
                }
                currentImports.push(data)
            }
            else if (key.startsWith('import-') && importData[key]) {
                data = {
                    namedImports: [{ name: importData[key], alias: undefined }],
                    moduleSpecifier: module
                }
                currentImports.push(data)
            }
        })
    })
    const jsxElementsData = []
    nodes.forEach(n => {
        if (jsxNodeIds.includes(n.id)) {
            jsxElementsData.push({
                ...n.data,
                tagName: nodeData[n.id].name
            })
        }
    });

    function checkExistence(tagName) {
        for (let imp of currentImports) {
            if (imp.defaultImport === tagName) {
                return true;
            }

            if (imp.namedImports) {
                for (let named of imp.namedImports) {
                    if (named.name === tagName) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    function processJsxData() {
        let result = [];
      
        for (let element of jsxElementsData) {
          const { tagName, namedImports, defaultImport } = element;
      
          // Caso en que "tagName" no exista en currentImports, y no tenga "namedImports" o "defaultImport".
          if (!checkExistence(tagName) && !namedImports && !defaultImport) {
            result.push({ defaultImport: tagName });
          }
      
          // Caso en que "tagName" no exista en currentImports, pero tenga "namedImports" o "defaultImport".
          if (!checkExistence(tagName) && (namedImports || defaultImport)) {
            result.push(element);
          }
        }
      
        return result;
      }

    const result = processJsxData()
    return result
}
export { capitalizeFirstLetter }