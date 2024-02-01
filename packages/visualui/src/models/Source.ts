import {
    Project, Node, SourceFile,
    IndentationText, SyntaxKind,
    ScriptTarget, ScriptKind,
    LanguageVariant
} from "ts-morph";
import parserTypeScript from "prettier/parser-typescript";
import prettier from "prettier";


export class Source {
    ast: any
    constructor(ast: SourceFile) {
        this.ast = ast
    }

    static new(source: string): Source {
        const project = new Project({
            useInMemoryFileSystem: true,
            manipulationSettings: { indentationText: IndentationText.Tab },
            compilerOptions: {
                target: ScriptTarget.Latest,
                scriptKind: ScriptKind.TSX,
                languageVariant: LanguageVariant.JSX
            },
        })
        return new Source(project.createSourceFile('_temp2.tsx', source, { overwrite: true }))
    }

    data( customIdentifier?: () => string | number): any { // Gets craftJS nodes
      if (customIdentifier) {
          this.identifyElements(customIdentifier)
      }
      const content = this.getContent();
      let craftNodes = Source.toCraftNodes(content)
      craftNodes = this.addCustomProps(craftNodes) // Adds imports
      return craftNodes;
    }

    getContent(): Node {
        return this.getFirstDescendant('JsxElement')
    }

    getFirstDescendant(kindName?: string): any {
        const kind = SyntaxKind[kindName]
        return kindName ?
            this.ast?.getFirstDescendantByKind(kind)
            : this.ast?.getFirstDescendant();
    }

    // x
    static getAllJsxElements(node: any): any {
        const mainNode = node;
        const allChildren = this.getAllJsxChildren(mainNode)
        const allJsxElements = [mainNode, ...allChildren]
        return allJsxElements
    }

    static getAttributes(node: any): any {
        const isJsxElement = this.isKind(node, "JsxElement")
        const isJsxSelfClosingElement = this.isKind(node, "JsxSelfClosingElement")
        const isJsxExpression = this.isKind(node, "JsxExpression")
        if (!node || (!isJsxElement && !isJsxSelfClosingElement && !isJsxExpression)) throw "Not valid node to get attributes"
        if (isJsxElement) {
            return this.getJsxElementAttributes(node)
        }
        if (isJsxSelfClosingElement) {
            return this.getJsxSelfClosingElementAttributes(node)
        }
        if (isJsxExpression) {
          return []
        }    
    }

    static getJsxAttribute(node: any, attributeKey: string): any { // Returns JsxAttribute
        if (!node || (!this.isKind(node, 'JsxElement') && !this.isKind(node, 'JsxSelfClosingElement'))) throw "Error node provided is not a JsxElement or JsxSelfClosingElement, can't get the specified attribute"
        const matchedJsxAttribute: any = this.getAttributes(node).find((jsxAtr: any) => jsxAtr.getNameNode().getText() == attributeKey)
        if (!matchedJsxAttribute) throw `Can't get attribute ${attributeKey}`
        return matchedJsxAttribute;
    }

    static getAttributeKey(node: any): string {
        if (!node || !this.isKind(node, 'JsxAttribute')) throw "Can't get attribute key, the node provided isn't a JsxAttribute"
        return node.getNameNode().getText()
    }

    static getAttributeValue(node: any): any { // returns a Node
        if (!node || !this.isKind(node, 'JsxAttribute')) throw "Can't get attribute value, the node provided isn't a JsxAttribute"
        return node.getInitializer()
    }

    static getJsxElementAttributes(node: any): any {
        if (!node || !this.isKind(node, 'JsxElement')) throw "Error node provided is not a JsxElement, can't get its attributes"
        return node.getOpeningElement().getAttributes()
    }

    static getJsxSelfClosingElementAttributes(node: any): any {
        if (!node || !this.isKind(node, 'JsxSelfClosingElement')) throw "Error node provided is not a JsxSelfClosingElement, can't get its attributes"
        return node.getAttributes()
    }

    static getJsxNodeName(node: any): any {
        const isJsxElement = this.isKind(node, "JsxElement")
        const isJsxSelfClosingElement = this.isKind(node, "JsxSelfClosingElement")
        const isJsxExpression = this.isKind(node, "JsxExpression")
        if (!node || (!isJsxElement && !isJsxSelfClosingElement && !isJsxExpression)) throw "Not valid node to get Name"
        if (isJsxElement) {
            return this.getJsxElementIdentifier(node)
        }
        if (isJsxSelfClosingElement) {
            return this.getJsxSelfClosingElementIdentifier(node)
        }
        if (isJsxExpression) {
            return { name: "ReactCode"}
        }
    }

    static getJsxElementIdentifier(node: any): any {
        if (!node || !this.isKind(node, 'JsxElement')) throw "Error node provided is not a JsxElement, can't get its Identifier"
        const openingElement: any = node.getOpeningElement();
        const identifier: any = openingElement.getTagNameNode()
        const identifierName: string = identifier.getText()
        return { node: identifier, name: identifierName }
    }

    static getJsxSelfClosingElementIdentifier(node: any): any {
        if (!node || !this.isKind(node, 'JsxSelfClosingElement')) throw "Error node provided is not a JsxSelfClosingElement, can't get its Identifier"
        const identifier: any = node.getTagNameNode()
        const identifierName: string = identifier.getText()
        return { node: identifier, name: identifierName }
    }

    static getJsxChildren(node: any): any[] {
        if (this.isKind(node, 'JsxSelfClosingElement')) throw "Can't obtain children from JsxSelfClosingElement"
        if (!node || !this.isKind(node, 'JsxElement')) throw "Can't obtain node children"
        const childSyntaxList = node.getChildrenOfKind(SyntaxKind.SyntaxList)[0];
        const children = childSyntaxList.getChildren();
        return children
    }

    static getJsxTextOfJsxElement(node: any): any {
        if (this.isKind(node, 'JsxExpression')) return undefined
        if (this.isKind(node, 'JsxSelfClosingElement')) return undefined // Self closing element can't have children
        const children = this.getJsxChildren(node)
        if (children.length && this.isKind(children[0], 'JsxText')) return children[0]
    }

    static getJsxChildrenFirstLevel(node: any): any[] {
        if (this.isKind(node, 'JsxSelfClosingElement') || this.isKind(node, 'JsxExpression')) return
        return this.getJsxChildren(node).filter(c => this.isKind(c, 'JsxElement') || this.isKind(c, 'JsxSelfClosingElement') || this.isKind(c, 'JsxExpression'))
    }

    static getAllJsxChildren(node: any): any[] {
        let jsxChildren
        try { // Try-catch to avoid crash when analize a node that is not a JsxElement/JsxSelfClosingElement
            jsxChildren = this.getJsxChildrenFirstLevel(node)
            jsxChildren.forEach(c => {
                jsxChildren = [...jsxChildren, ...this.getAllJsxChildren(c)]
            })
        } catch (e) { }
        return jsxChildren?.sort((a, b) => a.getPos() - b.getPos()) ?? []
    }

    static isKind(node: any, kindName: string): boolean {
        return kindName == node.getKindName()
    }

    static getNodeData(node: any): any {
        const name = this.getJsxNodeName(node).name
        const attributes = this.getAttributes(node)
        let props: any = {}
        let custom: any = { _nodeType: node.getKindName() }
        // GET Attributes
        attributes.forEach(jsxAtr => {
            const attrKey = this.getAttributeKey(jsxAtr)
            const attrValue = this.getAttributeValue(jsxAtr)
            const { value, nodeKind } = this.nodeValueFactory(attrValue)
            if (value && attrKey) {
                props = { ...props, [attrKey]: value }
            }
            if (nodeKind && attrKey) {
                custom = { ...custom, [attrKey]: nodeKind }
            }
        })
        // GET JsxText Children
        const jsxText = this.getJsxTextOfJsxElement(node)
        if (jsxText && jsxText.getText()) {
            props = { ...props, "children": jsxText.getText() }
            custom = { ...custom, "children": "StringLiteral" }
        }

        return {
            "type": {
                "resolvedName": name
            },
            "isCanvas": true,
            "props": props,
            "displayName": name,
            "custom": custom,
            "hidden": false,
            "nodes": [],
            "linkedNodes": {},
        }
    }

    static flatten(node: any, tree, parent: any): any {
        if (!node || (!this.isKind(node, 'JsxElement') && !this.isKind(node, 'JsxSelfClosingElement') && !this.isKind(node, 'JsxExpression'))) {
            return // throw "Can't provide flatten to node that has not JsxElement or JsxSelfClosingElement kind"
        }

        const uuid = Source.getIdentifier(node) ?? this.getIdFromSourceCode(node)
        const nodeData = this.getNodeData(node)
        let nodes: any[] = []
        let childs = this.getJsxChildrenFirstLevel(node)
        for (let i = 0; i < childs?.length; i++) {
            const child: any = childs[i]
            nodes.push(this.flatten(child, tree, uuid))
        }
        let craftNode = {
            ...nodeData,
            nodes: nodes,
            parent: parent,
        }
        tree[uuid] = craftNode
        return uuid
    }

    static getNodes(node: any) {
        if (!node || !this.isKind(node, 'JsxElement')) throw "Can't getNodes from the give node that has no kind of type JsxElement"
        const tree = {} // Craft.JS format to build nodes
        this.flatten(node, tree, "ROOT")
        if (!node || !this.isKind(node, 'JsxElement')) throw "Can't getNodes from the give node that has no kind of type JsxElement"
        return tree
    }

    static toCraftNodes(node: any): any { // Add ROOT node and Theme node and generate Craft nodes using provided node
        let rootNodeData = {
            "type": {
                "resolvedName": "Root"
            },
            "isCanvas": true,
            "props": {
                "data-cy": "root-container"
            },
            "displayName": "Root",
            "custom": {},
            "hidden": false,
            "nodes": [],
            "linkedNodes": {}
        }
        const rootChilds: any = this.getNodes(node)
        const firstChildUUID = Object.keys(rootChilds)?.find((key) => rootChilds[key].parent == 'ROOT')
        let nodes = {}

        if (firstChildUUID) {
            rootNodeData = { ...rootNodeData, nodes: [...rootNodeData.nodes, firstChildUUID] }
            nodes = {
                ...rootChilds, ["ROOT"]: rootNodeData,
                // ["theme-id"]: themeNodeData 
            }
        }
        else { // There is no first child so add the ROOT
            nodes = { ["ROOT"]: rootNodeData }
        }
        return nodes
    }

    addCustomProps(craftNodes: any): any { // Adds imports info to craftJs node "custom" key
        const importDeclarations: any[] = this.getImportDeclarations()
        let newCraftNodes = {} // Craft nodes with custom props
        Object.keys(craftNodes).forEach((id) => {
            const craftNode = craftNodes[id]
            const nodeImportsInfo = Source.getDisplayNameInNamedImports(craftNode.displayName, importDeclarations)
            const newCraftNode = { ...craftNode, "custom": { ...craftNode.custom, ...nodeImportsInfo } }
            newCraftNodes = { ...newCraftNodes, [id]: newCraftNode }
        })
        return newCraftNodes
    }

    getImportDeclarations(): any {
        const importDeclarations: any[] = this.ast.getImportDeclarations();
        let res = []
        importDeclarations.forEach(imp => {
            const namedImportsNodes = imp.getNamedImports().length ? imp.getNamedImports() : undefined;
            const namedImports = namedImportsNodes?.map(ni => ({ "name": ni.getName(), "alias": ni.getAliasNode()?.getText() }))
            const defaultImport = imp.getDefaultImport()?.getText()
            const moduleSpecifier = imp.getModuleSpecifier()?.getText()
            res = [...res, { namedImports, defaultImport, moduleSpecifier }]
        })
        return res;
    }

    static getDisplayNameInNamedImports(displayName: string, importDeclarations: any[]) { // Get import info of craftjs node
        for (let i = 0; i < importDeclarations?.length; i++) {
            const currentImport = importDeclarations[i]
            const namedImports = currentImport?.namedImports;
            const defaultImport = currentImport?.defaultImport
            const moduleSpecifier = currentImport?.moduleSpecifier
            if (defaultImport === displayName) {
                return {
                    "defaultImport": displayName,
                    "moduleSpecifier": moduleSpecifier
                }
            }

            if (namedImports) {
                for (let j = 0; j < namedImports?.length; j++) {
                    const namedImport = namedImports[j]
                    const name = namedImport?.name
                    const alias = namedImport?.alias
                    if (alias === displayName || name === displayName) {
                        return {
                            "namedImportName": name,
                            "namedImportAlias": alias,
                            "moduleSpecifier": moduleSpecifier
                        }
                    }
                }
            }
        }
        return {};
    }

    identifyElements(customIdentifier: () => number | string): Source { // Identify elements of source code adding to JsxElements a prop named _nodeId with uuid
        let allJsxElements = Source.getAllJsxElements(this.getContent())
        for (let i = 0; i < allJsxElements.length; i++) {
            let additionalProp = ""
            let posToInsertAttr
            allJsxElements = Source.getAllJsxElements(this.getContent())
            const jsxElementAttributes = Source.getAttributes(allJsxElements[i])
            try {
                Source.getJsxAttribute(allJsxElements[i], '_nodeId')
            } catch (e) { // If _nodeId is not found add it
                //@ts-ignore
                additionalProp += ` _nodeId="${customIdentifier ? customIdentifier(): Source.getSameIdAsFlows(allJsxElements[i])}" `
            }
            if (!jsxElementAttributes.length) {
                posToInsertAttr = Source.getJsxNodeName(allJsxElements[i]).node.getEnd();
            } else {
                posToInsertAttr = jsxElementAttributes[0].getStart();
            }
            this.ast.insertText(posToInsertAttr, writer => writer.write(additionalProp));
        }
        return this
    }

    static getIdentifier(node: any): string {
        try {
            const jsxAtr: any = Source.getJsxAttribute(node, '_nodeId')
            const elem_uuid: any = Source.getAttributeValue(jsxAtr)
            return this.nodeValueFactory(elem_uuid).value
        } catch (e) { console.error("Could not find node identifier") }
    }

    unidentifyElements(): Source { // Unidentify elements of source code deleting the prop "_nodeId" of JsxElements
        let allJsxElements = Source.getAllJsxElements(this.getContent())
        for (let i = 0; i < allJsxElements.length; i++) {
            allJsxElements = Source.getAllJsxElements(this.getContent())
            try {
                const jsxAtribute_nodeId = Source.getJsxAttribute(allJsxElements[i], '_nodeId')
                this.ast.removeText(jsxAtribute_nodeId.getStart(), jsxAtribute_nodeId.getEnd());
            } catch (e) { } // prop "_nodeId not found"
        }
        return this;
    }

    static getJsxElementByIdentifier(node: any, uuid: string): any {
        const allJsxElements = this.getAllJsxElements(node)
        const matchedElement = allJsxElements.find(e => this.getIdentifier(e) == uuid)
        if (!matchedElement) throw `Could not find element specified with uuid "${uuid}" in the provided node`
        return matchedElement
    }

    convertJsxExpressionToJsxElement(): Source {
      const getCurrentJsxExpressions = () => {
          const content = this.getContent()
          let allJsxElements = Source.getAllJsxElements(content)
          let currentJsxExpressions = allJsxElements.filter(ele => ele.getKindName() == "JsxExpression")
          return currentJsxExpressions
      }
      const convertText = (initExpress) => {
          if (initExpress.length) {
              // NOTE: ReactCode is disabled until we figure out how to show them to users (to enable change '' for reactCode const).
              // const reactCode = `<ReactCode codeBlock="${allJsxElements[i].getText()}"/>`
              this.ast.replaceText([initExpress[0].getPos(), initExpress[0].getEnd()], '');
              convertText(getCurrentJsxExpressions())
          }
      }
      convertText(getCurrentJsxExpressions())
      return this
  }

    static reactElementFactory(craftNode: any, childElem: string): string {
        let element; // JsxElement (or selfclosing) or JsxExpression block
        const displayName = craftNode.displayName
        switch (displayName) {
            case "ReactCode":
                const jsxBlock = craftNode.props.codeBlock
                element = `${jsxBlock}`
                break;
            default:
                let props = "";
                let childrenText;
                Object.keys(craftNode.props).filter(p => !['_nodeId',].includes(p)).forEach(p => {
                    let value = craftNode.props[p]
                    if (craftNode.custom[p] == 'StringLiteral' && p != "children") value = `"${value}"` // Adds double cuotes to string literals
                    if (p == 'children') {
                        // TODO:  compare it with meta props && craftNode.custom[p] == 'StringLiteral') {
                        childrenText = value
                        return;
                    }
                    switch (value) {
                        case undefined:
                            props += ` ${p}`
                            break;
                        default:
                            props += ` ${p}=${value}`
                            break;
                    }
                })
                switch (craftNode.custom["_nodeType"]) {
                    case "JsxSelfClosingElement":
                        const childrenProp = childrenText ? ` children="${childrenText}"` : ""
                        element = "<" + `${displayName}` + props + childrenProp + "/>"
                        break;
                    default: //JsxElement and others
                        element = "<" + `${displayName}` + props + ">" + `${childrenText ?? ""}` + childElem + "</" + `${displayName}` + ">"
                        break;
                }
                break;
        }
        return element
    }

    static nodeValueFactory(node: any): any { // Receives element
        let atrVal
        const nodeKind = node?.getKindName()
        switch (nodeKind) {
            case 'StringLiteral':
                atrVal = node?.getLiteralValue();
                break;
            default: //e.g JsxExpression
                atrVal = node?.getText()
                break;
        }
        return { value: atrVal, nodeKind }
    }

    static getIdFromSourceCode(node) {
        try {
            return node.getKindName() + '_' + node._compilerNode.pos + '_' + node._compilerNode.end
        } catch (e) {
            return node
        }
    }
}