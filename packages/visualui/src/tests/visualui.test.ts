import Source, { resetTestUUID } from 'visualui/src/models/Source';

beforeEach(() => {
    return resetTestUUID();
});
describe("Test Node Ops", () => {
    describe("Test JsxElement operations", () => {
        it("gets the first JsxElement of sourceFile", () => {
            const source1 = `<View atr1="1" atr2={2} atr3 atr4={{background:"red"}}><Box></Box><Text>hello</Text></View>`
            const firstJsxElement: any = Source.parse(source1).getContent();
            expect(firstJsxElement.getText()).toBe('<View atr1="1" atr2={2} atr3 atr4={{background:"red"}}><Box></Box><Text>hello</Text></View>')
        })
        describe("Test JsxElement Identifier (Tag name)", () => {
            it("check if correct kindName", () => {
                const source = `<NativeBaseProvider></NativeBaseProvider>`
                const firstJsxElement: any = Source.parse(source).getFirstDescendant("JsxElement");
                const isJsxElement = Source.isKind(firstJsxElement, 'JsxElement');
                const isIdentifier = Source.isKind(firstJsxElement, 'Identifier');
                expect(isJsxElement).toBe(true);
                expect(isIdentifier).toBe(false);
            })
            it("get JsxElement Identifier", () => {
                const source = `<NativeBaseProvider></NativeBaseProvider>`
                const firstJsxElement: any = Source.parse(source).getFirstDescendant("JsxElement");
                const identifierName = Source.getJsxElementIdentifier(firstJsxElement).name;
                const expected = 'NativeBaseProvider'
                expect(identifierName).toBe(expected);
            });
            it("get JsxSelfClosingElement Identifier", () => {
                const source = `<NativeBaseProvider/>`
                const firstJsxSelfClosingElement: any = Source.parse(source).getFirstDescendant("JsxSelfClosingElement");
                const identifierName: string = Source.getJsxSelfClosingElementIdentifier(firstJsxSelfClosingElement).name
                const expected = 'NativeBaseProvider'
                expect(identifierName).toBe(expected);
            });
            it("obtains elements names using getJsxElementName", () => {
                const source1 = `<NameOne/>`
                const element1: any = Source.parse(source1).getFirstDescendant("JsxSelfClosingElement");
                const source2 = `<NameTwo></NameTwo>`
                const element2: any = Source.parse(source2).getFirstDescendant("JsxElement");
                const res1 = Source.getJsxElementName(element1).name
                const res2 = Source.getJsxElementName(element2).name
                const expect1 = "NameOne"
                const expect2 = "NameTwo"
                expect(res1).toBe(expect1);
                expect(res2).toBe(expect2);
            })
        })
        describe("Test JsxElement attributes", () => {
            it("obtains all attributes using getAttributes", () => {
                const source1 = `<View atr1="1" atr2={2} atr3></View>`
                const element1: any = Source.parse(source1).getFirstDescendant("JsxElement");
                const attributesArr1: any = Source.getAttributes(element1);
                expect(attributesArr1.length).toBe(3)
                const source2 = `<View></View>`
                const element2: any = Source.parse(source2).getFirstDescendant("JsxElement");
                const attributesArr2: any = Source.getAttributes(element2);
                expect(attributesArr2.length).toBe(0)
                const source3 = `<View atr1="1"/>`
                const element3: any = Source.parse(source3).getFirstDescendant("JsxSelfClosingElement");
                const attributesArr3: any = Source.getAttributes(element3);
                expect(attributesArr3.length).toBe(1)
            })
            it("obtains all JsxAttributes from a JsxElement", () => {
                const source = `<View atr1="1" atr2={2} atr3></View>`
                const element: any = Source.parse(source).getFirstDescendant("JsxElement");
                const attributesArr: any = Source.getJsxElementAttributes(element);
                expect(attributesArr.length).toBe(3)
            })
            it("obtains all JsxAttributes from a JsxSelfClosingElement", () => {
                const source = `<View atr1="1" atr2={2} atr3/>`
                const element: any = Source.parse(source).getFirstDescendant("JsxSelfClosingElement");
                const attributesArr: any = Source.getJsxSelfClosingElementAttributes(element);
                expect(attributesArr.length).toBe(3)
            })
            it("obtains all specific attribute from a JsxElement", () => {
                const source = `<View atr1="1" atr2={2} atr3></View>`
                const element: any = Source.parse(source).getFirstDescendant("JsxElement");
                const matchedAtribute1: any = Source.getJsxAttribute(element, 'atr1');
                const atributeKeyName = matchedAtribute1.getNameNode().getText()
                expect(atributeKeyName).toBe('atr1')
            })
            it("obtains attribute key from JsxAttribute", () => {
                const source1 = `<View atr1="1" atr2={2} atr3></View>`
                const element1: any = Source.parse(source1).getFirstDescendant("JsxElement");
                const matchedAtribute1: any = Source.getJsxAttribute(element1, 'atr1');
                const matchedAtributeKey1 = Source.getAttributeKey(matchedAtribute1)
                expect(matchedAtributeKey1).toBe('atr1')
                const source2 = `<View atr2={2}/>`
                const element2: any = Source.parse(source2).getFirstDescendant("JsxSelfClosingElement");
                const matchedAtribute2: any = Source.getJsxAttribute(element2, 'atr2');
                const matchedAtributeKey2 = Source.getAttributeKey(matchedAtribute2)
                expect(matchedAtributeKey2).toBe('atr2')
            })
            it("obtains attribute value from JsxAttribute", () => {
                const source1 = `<View atr1="1" atr2={2} atr3></View>`
                const element: any = Source.parse(source1).getFirstDescendant("JsxElement");
                const matchedAtribute1: any = Source.getJsxAttribute(element, 'atr1');
                const matchedAtributeValue1 = Source.getAttributeValue(matchedAtribute1);
                expect(matchedAtributeValue1.getText()).toBe('"1"')
                expect(Source.isKind(matchedAtributeValue1, 'StringLiteral')).toBe(true)
                const matchedAtribute2: any = Source.getJsxAttribute(element, 'atr2');
                const matchedAtributeValue2 = Source.getAttributeValue(matchedAtribute2);
                expect(matchedAtributeValue2.getText()).toBe('{2}')
                expect(Source.isKind(matchedAtributeValue2, 'JsxExpression')).toBe(true)
                const matchedAtribute3: any = Source.getJsxAttribute(element, 'atr3'); // Has no value
                const matchedAtributeValue3: any = Source.getAttributeValue(matchedAtribute3);
                expect(matchedAtributeValue3).toBe(undefined)
            })
            it("obtains the identifier value prop of JsxElement", () => {
                const source1 = `<View></View>`
                let sourceFile1 = Source.parse(source1)
                sourceFile1 = sourceFile1.identifyElements(true)
                const content1 = sourceFile1.getContent()
                expect(Source.getIdentifier(content1)).toBe('nodeId-0')
                resetTestUUID()
                const source2 = `<View><Input/></View>`
                let sourceFile2 = Source.parse(source2)
                sourceFile2 = sourceFile2.identifyElements(true)
                const content2 = sourceFile2.getContent()
                const selfClosingElement = Source.getJsxElementByIdentifier(content2, 'nodeId-1')
                expect(Source.getIdentifier(selfClosingElement)).toBe('nodeId-1')
            })
        })
        describe("Methods with identify/unidentify props to source jsxElements", () => {
            it("adds _nodeId to all JsxElements of soruce", () => {
                const source1 = `<Text><Input/><Button><Icon/></Button><Box></Box></Text>`
                const newSource1 = Source.parse(source1).identifyElements(true);
                expect(newSource1.getContent().getText()).toBe(`<Text _nodeId="nodeId-0" ><Input _nodeId="nodeId-1" /><Button _nodeId="nodeId-2" ><Icon _nodeId="nodeId-3" /></Button><Box _nodeId="nodeId-4" ></Box></Text>`)
                resetTestUUID()
                const source2 = '<View atr1="1" atr2={2} atr3></View>'
                const newSource2 = Source.parse(source2).identifyElements(true);
                expect(newSource2.getContent().getText()).toBe(`<View  _nodeId="nodeId-0" atr1="1" atr2={2} atr3></View>`)
                resetTestUUID()
                const source3 = `<Text atr1="1" atr2={2} atr3><Input atr1="1" atr2={2} atr3/><Button atr1="1" atr2={2} atr3><Icon atr1="1" atr2={2} atr3/></Button><Box atr1="1" atr2={2} atr3></Box></Text>`
                const newSource3 = Source.parse(source3).identifyElements(true);
                expect(newSource3.getContent().getText()).toBe(`<Text  _nodeId="nodeId-0" atr1="1" atr2={2} atr3><Input  _nodeId="nodeId-1" atr1="1" atr2={2} atr3/><Button  _nodeId="nodeId-2" atr1="1" atr2={2} atr3><Icon  _nodeId="nodeId-3" atr1="1" atr2={2} atr3/></Button><Box  _nodeId="nodeId-4" atr1="1" atr2={2} atr3></Box></Text>`)
            })
            it("preserve _nodeId prop if the node has it", () => {
                const source1 = `<Text _nodeId="rocket" atr="nasa"></Text>`
                const newSource1 = Source.parse(source1).identifyElements(true);
                expect(newSource1.getContent().getText()).toBe(`<Text _nodeId="rocket" atr="nasa"></Text>`)
                resetTestUUID()
                const source2 = `<Text _nodeId="rocket"><Input/><Button _nodeId="nasa"><Icon _nodeId="protofito"/></Button><Box></Box></Text>`
                const newSource2 = Source.parse(source2).identifyElements(true);
                expect(newSource2.getContent().getText()).toBe(`<Text _nodeId="rocket"><Input _nodeId="nodeId-0" /><Button _nodeId="nasa"><Icon _nodeId="protofito"/></Button><Box _nodeId="nodeId-1" ></Box></Text>`)
                resetTestUUID()
            })
            it("deletes _nodeId prop if the node has it", () => {
                const source1 = `<Text _nodeId="rocket" atr="nasa"></Text>`
                const newSource1 = Source.parse(source1).unidentifyElements();
                expect(newSource1.getContent().getText()).toBe(`<Text  atr="nasa"></Text>`)
                const source2 = `<Text atr="nasa"></Text>`
                const newSource2 = Source.parse(source2).unidentifyElements();
                expect(newSource2.getContent().getText()).toBe(`<Text atr="nasa"></Text>`)
            })
            it("verify complete flow of identify/unidentify nodes", () => {
                const source1 = `<Text _nodeId="rocket"><Input/><Button _nodeId="nasa"><Icon _nodeId="protofito"/></Button><Box></Box></Text>`
                let newSource1 = Source.parse(source1).identifyElements(true);
                expect(newSource1.getContent().getText()).toBe(`<Text _nodeId="rocket"><Input _nodeId="nodeId-0" /><Button _nodeId="nasa"><Icon _nodeId="protofito"/></Button><Box _nodeId="nodeId-1" ></Box></Text>`)
                newSource1 = newSource1.unidentifyElements()
                expect(newSource1.getContent().getText()).toBe(`<Text ><Input  /><Button ><Icon /></Button><Box  ></Box></Text>`)
                resetTestUUID()
            })
        })
        describe("Test jsxElement", () => {
            it("gets all jsxElements of main content", () => {
                const source1 = `
                    <NativeBaseProvider>
                        <Background>
                            <Text></Text>
                            <Box>
                                <MyComponent></MyComponent>
                                <Input/>
                            </Box>
                            <input/>
                        </Background>
                    </NativeBaseProvider>
                `
                const mainJsxElement1 = Source.parse(source1).getContent()
                const allJsxElements1 = Source.getAllJsxElements(mainJsxElement1)
                expect(allJsxElements1.length).toBe(7)
                const source2 = `<Text><Input/><Button><Icon/></Button><Box></Box></Text>`
                const mainJsxElement2 = Source.parse(source2).getContent()
                const allJsxElements2 = Source.getAllJsxElements(mainJsxElement2)
                expect(allJsxElements2.length).toBe(5)
            })
        })
        describe("Test JsxElement children", () => {
            it("finds JsxElement children", () => {
                const source1 = `<View atr1="1" atr2={2} atr3><View></View><Text>hello</Text></View>`
                const element1: any = Source.parse(source1).getFirstDescendant("JsxElement");
                const children1: any[] = Source.getJsxChildren(element1)
                expect(children1.length).toBe(2)
                expect(Source.isKind(children1[0], 'JsxElement')).toBe(true)
                expect(children1[0].getText()).toBe("<View></View>")
                expect(Source.isKind(children1[1], 'JsxElement')).toBe(true)
                expect(children1[1].getText()).toBe("<Text>hello</Text>")
                const source2 = `<View>{true?<View></View>:<Text>hello</Text>}</View>`
                const element2: any = Source.parse(source2).getFirstDescendant("JsxElement");
                const children2: any[] = Source.getJsxChildren(element2)
                expect(children2.length).toBe(1)
                expect(Source.isKind(children2[0], 'JsxExpression')).toBe(true)
            })
            it("finds all first level children nodes of kind JsxElements/JsxSelfClosingElements/JsxExpression", () => {
                const source1 = `
                    <View>
                        <View></View>
                        <Text>hello</Text>
                        <Box>
                            <View></View>
                        </Box>
                        <Input/>
                    </View>
                    `
                const element1 = Source.parse(source1).getFirstDescendant("JsxElement");
                const children1: any[] = Source.getJsxChildrenFirstLevel(element1)
                expect(children1.length).toBe(4)
                const source2 = `
                    <View>
                        <View></View>
                        <Text atr={() => {}}>hello</Text>
                        {
                            <MyComp atr={()=>{}}/>
                            <MyComp2/>
                        }
                    </View>
                    `
                const element2 = Source.parse(source2).getContent();
                const children2: any[] = Source.getJsxChildrenFirstLevel(element2)
                expect(children2.length).toBe(3)

            })
            it("finds all children JsxElements/JsxSelfClosingElements/JsxExpression", () => {
                const source1 = `<View><View atr="1"></View><Text atr="2">hello</Text><Box atr="3"><View atr="4"><View></View></View></Box><Input atr="5"/></View>`
                const element1 = Source.parse(source1).getFirstDescendant("JsxElement");
                const children1: any[] = Source.getAllJsxChildren(element1)
                expect(children1.length).toBe(6)
                // Test preserve order on results
                expect(children1[0].getText()).toBe('<View atr="1"></View>')
                expect(children1[1].getText()).toBe('<Text atr="2">hello</Text>')
                expect(children1[2].getText()).toBe('<Box atr="3"><View atr="4"><View></View></View></Box>')
                expect(children1[3].getText()).toBe('<View atr="4"><View></View></View>')
                expect(children1[4].getText()).toBe('<View></View>')
                expect(children1[5].getText()).toBe('<Input atr="5"/>')
                const source2 = `<View><View atr="1"><Box></Box></View>{<Box atr={()=> {}}><Input/></Box>}<Input atr="5"/></View>`
                const element2 = Source.parse(source2).getContent()
                const children2: any[] = Source.getAllJsxChildren(element2)
                expect(children2.length).toBe(4)
            })
            it("finds children of JsxText of given JsxElement", () => {
                const source1 = '<Text>Hello world</Text>'
                const element1 = Source.parse(source1).getFirstDescendant("JsxElement");
                const children1: any = Source.getJsxTextOfJsxElement(element1)
                expect(children1.getText()).toBe("Hello world")
                const source2 = '<Text></Text>'
                const element2 = Source.parse(source2).getFirstDescendant("JsxElement");
                const children2: any = Source.getJsxTextOfJsxElement(element2)
                expect(children2?.getText()).toBe(undefined)
            })
        })
        describe("Test SyntaxKind of nodes", () => {
            it("checks types of nodes using isKind", () => {
                const source1 = `<View atr1="1" atr2={2} atr3></View>`
                const element1: any = Source.parse(source1).getFirstDescendant("JsxElement");
                const matchedAtribute1: any = Source.getJsxAttribute(element1, 'atr1');
                const matchedAtributeValue1 = Source.getAttributeValue(matchedAtribute1);
                expect(Source.isKind(element1, 'JsxElement')).toBe(true)
                expect(Source.isKind(matchedAtribute1, 'JsxAttribute')).toBe(true)
                expect(Source.isKind(matchedAtributeValue1, 'StringLiteral')).toBe(true)
                expect(Source.isKind(matchedAtributeValue1, 'JsxExpression')).toBe(false)
            })
        })
        describe("Test JsxElements retrieve", () => {
            it("retrieves a JsxElement by its uuid", () => {
                const source2 = `<View><Input/></View>`
                let sourceFile2 = Source.parse(source2)
                sourceFile2 = sourceFile2.identifyElements(true)
                const content2 = sourceFile2.getContent()
                expect(content2.getText()).toBe(`<View _nodeId="nodeId-0" ><Input _nodeId="nodeId-1" /></View>`)
                const selfClosingElement = Source.getJsxElementByIdentifier(content2, 'nodeId-1')
                expect(selfClosingElement.getText()).toBe(`<Input _nodeId="nodeId-1" />`)
            })
        })
        describe("Test transform from parent JsxElement all JsxExpression childs as JsxElemnt with tagName (ReactCode)", () => {
            it("transforms JsxExpressions to JsxElement with tagName (ReactCode)", () => {
                const source1 = `<View><View></View><View><Text atr={() => {}}>hello</Text></View>{<MyComp atr={()=>{}}><Hello/></MyComp>}</View>`
                const sourceFile1 = Source.parse(source1)
                const newSource1: Source = sourceFile1.convertJsxExpressionToJsxElement();
                expect(newSource1.ast.getText()).toBe(`<View><View></View><View><Text atr={() => {}}>hello</Text></View></View>`)
            })
        })
    })
    describe("Test ImportDeclaration operations", () => {
        const sourceText1 = "\
            import MyComponent1 from 'sourceImport1'\
            import {MyComponent2} from 'sourceImport2'\
            import MyComponent3, {MyComponent4, MyComponent5} from 'sourceImport3'\
            import {MyComponent_v1 as MyComponent_v2} from 'sourceImport4'\
        "
        const importDeclarations: any[] = Source.parse(sourceText1).getImportDeclarations()
        expect(importDeclarations.length).toBe(4)
        expect(importDeclarations[0]).toStrictEqual({
            "namedImports": undefined,
            "defaultImport": "MyComponent1",
            "moduleSpecifier": "'sourceImport1'"
        })
        expect(importDeclarations[1]).toStrictEqual({
            "namedImports": [{ "name": "MyComponent2", "alias": undefined }],
            "defaultImport": undefined,
            "moduleSpecifier": "'sourceImport2'"
        })
        expect(importDeclarations[2]).toStrictEqual({
            "namedImports": [{ "name": "MyComponent4", "alias": undefined }, { "name": "MyComponent5", "alias": undefined }],
            "defaultImport": "MyComponent3",
            "moduleSpecifier": "'sourceImport3'"
        })
        expect(importDeclarations[3]).toStrictEqual({
            "namedImports": [{ "name": "MyComponent_v1", "alias": "MyComponent_v2" }],
            "defaultImport": undefined,
            "moduleSpecifier": "'sourceImport4'"
        })
    })
    describe("Test transformations with nodes", () => {
        it("Test that JsxElement attributes are passed in correct format: ", () => {
            const source1 = `<View atr1="1" atr2={2} atr3 atr4={true} atr5={false} 
                atr6={"hello"} atr7={isAtr7?"hello":"rip"} atr8={isAtr8??false} atr9={myVar} atr10={myFunction()}
                atr11={() => {console.log("p")}} atr11={{"backgroundColor":"red","borderWidth":1, margin: MARGIN}}
            ></View>`
            const conent: any = Source.parse(source1).getContent()
            const elementJsxAtributes: any[] = Source.getAttributes(conent)
            const atr1_value = Source.nodeValueFactory(Source.getAttributeValue(elementJsxAtributes[0])).value
            expect(atr1_value).toBe("1")
            const atr2_value = Source.nodeValueFactory(Source.getAttributeValue(elementJsxAtributes[1])).value
            expect(atr2_value).toBe("{2}")
            const atr3_value = Source.nodeValueFactory(Source.getAttributeValue(elementJsxAtributes[2])).value
            expect(atr3_value).toBeUndefined()
            const atr4_value = Source.nodeValueFactory(Source.getAttributeValue(elementJsxAtributes[3])).value
            expect(atr4_value).toBe("{true}")
            const atr5_value = Source.nodeValueFactory(Source.getAttributeValue(elementJsxAtributes[4])).value
            expect(atr5_value).toBe("{false}")
            const atr6_value = Source.nodeValueFactory(Source.getAttributeValue(elementJsxAtributes[5])).value
            expect(atr6_value).toBe(`{"hello"}`)
            const atr7_value = Source.nodeValueFactory(Source.getAttributeValue(elementJsxAtributes[6])).value
            expect(atr7_value).toBe('{isAtr7?"hello":"rip"}')
            const atr8_value = Source.nodeValueFactory(Source.getAttributeValue(elementJsxAtributes[7])).value
            expect(atr8_value).toBe('{isAtr8??false}')
            const atr9_value = Source.nodeValueFactory(Source.getAttributeValue(elementJsxAtributes[8])).value
            expect(atr9_value).toBe('{myVar}')
            const atr10_value = Source.nodeValueFactory(Source.getAttributeValue(elementJsxAtributes[9])).value
            expect(atr10_value).toBe('{myFunction()}')
            const atr11_value = Source.nodeValueFactory(Source.getAttributeValue(elementJsxAtributes[10])).value
            expect(atr11_value).toBe('{() => {console.log("p")}}')
            const atr12_value = Source.nodeValueFactory(Source.getAttributeValue(elementJsxAtributes[11])).value
            expect(atr12_value).toBe('{{"backgroundColor":"red","borderWidth":1, margin: MARGIN}}')
        })
    })
})
describe("Test CraftData Ops", () => {
    describe("Test JsxElement to CraftData (CraftJS) node", () => {
        it("generates craft node given node", () => {
            const source1 = `<View atr1="1" atr2={2} atr3 atr4={{background:"red"}}><Box></Box><Text>hello</Text></View>`
            const firstJsxElement1: any = Source.parse(source1).getContent();
            const craftData1 = Source.getNodeData(firstJsxElement1)
            expect(craftData1).toStrictEqual({
                "type": {
                    "resolvedName": "View"
                },
                "isCanvas": true,
                "props": { "atr1": "1", "atr2": "{2}", "atr4": "{{background:\"red\"}}" },
                "displayName": "View",
                "custom": {
                    "_nodeType": "JsxElement",
                    "atr1": "StringLiteral",
                    "atr2": "JsxExpression",
                    "atr4": "JsxExpression",
                },
                "hidden": false,
                "nodes": [],
                "linkedNodes": {},
            })
            const jsxText = Source.getJsxChildrenFirstLevel(firstJsxElement1)[1]
            const craftData2 = Source.getNodeData(jsxText)
            expect(craftData2).toStrictEqual({
                "type": {
                    "resolvedName": "Text"
                },
                "isCanvas": true,
                "props": { "children": "hello" },
                "displayName": "Text",
                "custom": {
                    "children": "StringLiteral",
                    "_nodeType": "JsxElement",
                },
                "hidden": false,
                "nodes": [],
                "linkedNodes": {},
            })
            const source2 = `<View atr1="1" atr2={2} atr3 atr4={{background:"red"}}><Box></Box>{<Hello/>}<Text>hello</Text></View>`
            let sourceFile2: Source = Source.parse(source2)
            sourceFile2 = sourceFile2.convertJsxExpressionToJsxElement()
            const firstJsxElement2 = sourceFile2.getContent()
            const jsxElementReactCode = Source.getJsxChildrenFirstLevel(firstJsxElement2)[1]
            const craftData3 = Source.getNodeData(jsxElementReactCode)
            expect(craftData3).toStrictEqual({
                "type": {
                    "resolvedName": "Text"
                },
                "isCanvas": true,
                "props": { "children": "hello" },
                "displayName": "Text",
                "custom": {
                    "children": "StringLiteral",
                    "_nodeType": "JsxElement",
                },
                "hidden": false,
                "nodes": [],
                "linkedNodes": {},
            })
        })
        it("generates flatten list of craftNodes given node", () => {
            const source1 = `<View atr1="1" atr2={2} atr3 atr4={{background:"red"}}><Input value="hello"/><Text>hello</Text></View>`
            let sourceCode = Source.parse(source1)
            sourceCode = sourceCode.identifyElements(true)
            const sourceNode: any = sourceCode.getContent();
            const tree = {} // Craft.JS format to build nodes
            Source.flatten(sourceNode, tree, "ROOT")
            expect(tree).toStrictEqual({
                "nodeId-0": {
                    "type": {
                        "resolvedName": "View"
                    },
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxElement",
                        "atr1": "StringLiteral",
                        "atr2": "JsxExpression",
                        "atr4": "JsxExpression",
                    },
                    "isCanvas": true,
                    "parent": "ROOT",
                    "props": { "atr1": "1", "atr2": "{2}", "atr4": "{{background:\"red\"}}", "_nodeId": "nodeId-0", },
                    "displayName": "View",
                    "hidden": false,
                    "nodes": ["nodeId-1", "nodeId-2"],
                    "linkedNodes": {},
                },
                "nodeId-1": {
                    "type": {
                        "resolvedName": "Input"
                    },
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxSelfClosingElement",
                        "value": "StringLiteral",
                    },
                    "isCanvas": true,
                    "props": { "value": "hello", "_nodeId": "nodeId-1", },
                    "parent": "nodeId-0",
                    "displayName": "Input",
                    "hidden": false,
                    "nodes": [],
                    "linkedNodes": {},
                },
                "nodeId-2": {
                    "type": {
                        "resolvedName": "Text"
                    },
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxElement",
                        "children": "StringLiteral",
                    },
                    "isCanvas": true,
                    "props": { "children": "hello", "_nodeId": "nodeId-2", },
                    "parent": "nodeId-0",
                    "displayName": "Text",
                    "hidden": false,
                    "nodes": [],
                    "linkedNodes": {},
                }
            })
        })
        it("generates flatten list of craftNode using 'getNodes'", () => {
            const source1 = `<View atr1="1" atr2={2} atr3 atr4={{background:"red"}}><Input value="hello"/><Text>hello</Text></View>`
            let sourceNode = Source.parse(source1)
            sourceNode = sourceNode.identifyElements(true)
            const content = sourceNode.getContent();
            const tree = Source.getNodes(content)
            expect(tree).toStrictEqual({
                "nodeId-0": {
                    "type": {
                        "resolvedName": "View"
                    },
                    "isCanvas": true,
                    "parent": "ROOT",
                    "props": { "atr1": "1", "atr2": "{2}", "atr4": "{{background:\"red\"}}", "_nodeId": "nodeId-0", },
                    "displayName": "View",
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxElement",
                        "atr1": "StringLiteral",
                        "atr2": "JsxExpression",
                        "atr4": "JsxExpression",
                    },
                    "hidden": false,
                    "nodes": ["nodeId-1", "nodeId-2"],
                    "linkedNodes": {},
                },
                "nodeId-1": {
                    "type": {
                        "resolvedName": "Input"
                    },
                    "isCanvas": true,
                    "props": { "value": "hello", "_nodeId": "nodeId-1", },
                    "parent": "nodeId-0",
                    "displayName": "Input",
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxSelfClosingElement",
                        "value": "StringLiteral",
                    },
                    "hidden": false,
                    "nodes": [],
                    "linkedNodes": {},
                },
                "nodeId-2": {
                    "type": {
                        "resolvedName": "Text"
                    },
                    "isCanvas": true,
                    "props": { "children": "hello", "_nodeId": "nodeId-2", },
                    "parent": "nodeId-0",
                    "displayName": "Text",
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxElement",
                        "children": "StringLiteral",
                    },
                    "hidden": false,
                    "nodes": [],
                    "linkedNodes": {},
                }
            })
        })
        it("generates CraftJS nodes adding theme and ROOT node using 'toCraftNodes'", () => {
            const source1 = `<View atr1="1" atr2={2} atr3 atr4={{background:"red"}}><Input value="hello"/><Text>hello</Text></View>`
            let sourceNode1 = Source.parse(source1)
            sourceNode1 = sourceNode1.identifyElements(true)
            const content1 = sourceNode1.getContent();
            const tree1 = Source.toCraftNodes(content1)
            expect(tree1).toStrictEqual({
                "ROOT": {
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
                    "nodes": ["nodeId-0"],
                    "linkedNodes": {}
                },
                "nodeId-0": {
                    "type": {
                        "resolvedName": "View"
                    },
                    "isCanvas": true,
                    "parent": "ROOT",
                    "props": { "atr1": "1", "atr2": "{2}", "atr4": "{{background:\"red\"}}", "_nodeId": "nodeId-0" },
                    "displayName": "View",
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxElement",
                        "atr1": "StringLiteral",
                        "atr2": "JsxExpression",
                        "atr4": "JsxExpression",
                    },
                    "hidden": false,
                    "nodes": ["nodeId-1", "nodeId-2"],
                    "linkedNodes": {},
                },
                "nodeId-1": {
                    "type": {
                        "resolvedName": "Input"
                    },
                    "isCanvas": true,
                    "props": { "value": "hello", "_nodeId": "nodeId-1" },
                    "parent": "nodeId-0",
                    "displayName": "Input",
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxSelfClosingElement",
                        "value": "StringLiteral",
                    },
                    "hidden": false,
                    "nodes": [],
                    "linkedNodes": {},
                },
                "nodeId-2": {
                    "type": {
                        "resolvedName": "Text"
                    },
                    "isCanvas": true,
                    "props": { "children": "hello", "_nodeId": "nodeId-2" },
                    "parent": "nodeId-0",
                    "displayName": "Text",
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxElement",
                        "children": "StringLiteral",
                    },
                    "hidden": false,
                    "nodes": [],
                    "linkedNodes": {},
                }
            })
            resetTestUUID()
            const source2 = `<Background><Button></Button><View></View></Background>`
            let sourceNode2 = Source.parse(source2)
            sourceNode2 = sourceNode2.identifyElements(true)
            const content2 = sourceNode2.getContent();
            const tree2 = Source.toCraftNodes(content2)
            expect(tree2).toStrictEqual({
                "ROOT": {
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
                    "nodes": ["nodeId-0"],
                    "linkedNodes": {}
                },
                "nodeId-0": {
                    "type": {
                        "resolvedName": "Background"
                    },
                    "isCanvas": true,
                    "parent": "ROOT",
                    "props": { "_nodeId": "nodeId-0" },
                    "displayName": "Background",
                    "custom": { "_nodeId": "StringLiteral", "_nodeType": "JsxElement", },
                    "hidden": false,
                    "nodes": ["nodeId-1", "nodeId-2"],
                    "linkedNodes": {},
                },
                "nodeId-1": {
                    "type": {
                        "resolvedName": "Button"
                    },
                    "isCanvas": true,
                    "parent": "nodeId-0",
                    "props": { "_nodeId": "nodeId-1" },
                    "displayName": "Button",
                    "custom": { "_nodeId": "StringLiteral", "_nodeType": "JsxElement", },
                    "hidden": false,
                    "nodes": [],
                    "linkedNodes": {},
                },
                "nodeId-2": {
                    "type": {
                        "resolvedName": "View"
                    },
                    "isCanvas": true,
                    "parent": "nodeId-0",
                    "props": { "_nodeId": "nodeId-2" },
                    "displayName": "View",
                    "custom": { "_nodeId": "StringLiteral", "_nodeType": "JsxElement", },
                    "hidden": false,
                    "nodes": [],
                    "linkedNodes": {},
                },
            })
        })
        it("deletes CraftJS node from all CraftJS nodes", () => {
            const source1 = `<View atr1="1" atr2={2} atr3 atr4={{background:"red"}}><Input value="hello"/><Text>hello</Text></View>`
            let sourceNode = Source.parse(source1)
            sourceNode = sourceNode.identifyElements(true)
            const content = sourceNode.getContent();
            const tree = Source.toCraftNodes(content)
            expect(tree).toStrictEqual({
                "ROOT": {
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
                    "nodes": ["nodeId-0"],
                    "linkedNodes": {}
                },
                "nodeId-0": {
                    "type": {
                        "resolvedName": "View"
                    },
                    "isCanvas": true,
                    "parent": "ROOT",
                    "props": { "atr1": "1", "atr2": "{2}", "atr4": "{{background:\"red\"}}", "_nodeId": "nodeId-0" },
                    "displayName": "View",
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxElement",
                        "atr1": "StringLiteral",
                        "atr2": "JsxExpression",
                        "atr4": "JsxExpression",
                    },
                    "hidden": false,
                    "nodes": ["nodeId-1", "nodeId-2"],
                    "linkedNodes": {},
                },
                "nodeId-1": {
                    "type": {
                        "resolvedName": "Input"
                    },
                    "isCanvas": true,
                    "props": { "value": "hello", "_nodeId": "nodeId-1" },
                    "parent": "nodeId-0",
                    "displayName": "Input",
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxSelfClosingElement",
                        "value": "StringLiteral",
                    },
                    "hidden": false,
                    "nodes": [],
                    "linkedNodes": {},
                },
                "nodeId-2": {
                    "type": {
                        "resolvedName": "Text"
                    },
                    "isCanvas": true,
                    "props": { "children": "hello", "_nodeId": "nodeId-2" },
                    "parent": "nodeId-0",
                    "displayName": "Text",
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxElement",
                        "children": "StringLiteral",
                    },
                    "hidden": false,
                    "nodes": [],
                    "linkedNodes": {},
                }
            })
            const craftNodes_noTheme = Source.deleteCraftThemeNode(tree)
            expect(craftNodes_noTheme).toStrictEqual({
                "ROOT": {
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
                    "nodes": ["nodeId-0"],
                    "linkedNodes": {}
                },
                "nodeId-0": {
                    "type": {
                        "resolvedName": "View"
                    },
                    "isCanvas": true,
                    "parent": "ROOT",
                    "props": { "atr1": "1", "atr2": "{2}", "atr4": "{{background:\"red\"}}", "_nodeId": "nodeId-0" },
                    "displayName": "View",
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxElement",
                        "atr1": "StringLiteral",
                        "atr2": "JsxExpression",
                        "atr4": "JsxExpression",
                    },
                    "hidden": false,
                    "nodes": ["nodeId-1", "nodeId-2"],
                    "linkedNodes": {},
                },
                "nodeId-1": {
                    "type": {
                        "resolvedName": "Input",
                    },
                    "isCanvas": true,
                    "props": { "value": "hello", "_nodeId": "nodeId-1" },
                    "parent": "nodeId-0",
                    "displayName": "Input",
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxSelfClosingElement",
                        "value": "StringLiteral",
                    },
                    "hidden": false,
                    "nodes": [],
                    "linkedNodes": {},
                },
                "nodeId-2": {
                    "type": {
                        "resolvedName": "Text"
                    },
                    "isCanvas": true,
                    "props": { "children": "hello", "_nodeId": "nodeId-2" },
                    "parent": "nodeId-0",
                    "displayName": "Text",
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxElement",
                        "children": "StringLiteral",
                    },
                    "hidden": false,
                    "nodes": [],
                    "linkedNodes": {},
                }
            })
        })
        it("adds custom props (imports) to craft nodes", () => {
            const source1 = `
            import {View} from 'react-native';
            import {NativeInput as Input} from 'native-base';
            import Text from 'native-base'
            <View atr1="1" atr2={2} atr3 atr4={{background:"red"}}>
                <Input value="hello"/>
                <Text>hello</Text>
            </View>
            `
            let sourceNode = Source.parse(source1) // Source object
            sourceNode.identifyElements(true)
            const conent = sourceNode.getContent();
            const craftNodes = Source.toCraftNodes(conent)
            const newCraftNodes = sourceNode.addCustomProps(craftNodes)
            expect(newCraftNodes).toStrictEqual({
                'nodeId-1': {
                    type: { resolvedName: 'Input' },
                    isCanvas: true,
                    props: { _nodeId: 'nodeId-1', value: 'hello' },
                    displayName: 'Input',
                    custom: {
                        _nodeId: 'StringLiteral',
                        value: 'StringLiteral',
                        _nodeType: "JsxSelfClosingElement",
                        namedImportName: 'NativeInput',
                        namedImportAlias: 'Input',
                        moduleSpecifier: "'native-base'"
                    },
                    hidden: false,
                    nodes: [],
                    linkedNodes: {},
                    parent: 'nodeId-0'
                },
                'nodeId-2': {
                    type: { resolvedName: 'Text' },
                    isCanvas: true,
                    props: { _nodeId: 'nodeId-2', children: 'hello' },
                    displayName: 'Text',
                    custom: {
                        _nodeId: 'StringLiteral',
                        _nodeType: "JsxElement",
                        children: 'StringLiteral',
                        defaultImport: 'Text',
                        moduleSpecifier: "'native-base'"
                    },
                    hidden: false,
                    nodes: [],
                    linkedNodes: {},
                    parent: 'nodeId-0'
                },
                'nodeId-0': {
                    type: { resolvedName: 'View' },
                    isCanvas: true,
                    props: {
                        _nodeId: 'nodeId-0',
                        atr1: '1',
                        atr2: '{2}',
                        atr4: '{{background:"red"}}'
                    },
                    displayName: 'View',
                    custom: {
                        _nodeId: 'StringLiteral',
                        _nodeType: "JsxElement",
                        atr1: 'StringLiteral',
                        atr2: 'JsxExpression',
                        atr4: 'JsxExpression',
                        namedImportName: 'View',
                        namedImportAlias: undefined,
                        moduleSpecifier: "'react-native'"
                    },
                    hidden: false,
                    nodes: ['nodeId-1', 'nodeId-2'],
                    linkedNodes: {},
                    parent: 'ROOT'
                },
                ROOT: {
                    type: { resolvedName: 'Root' },
                    isCanvas: true,
                    props: { 'data-cy': 'root-container' },
                    displayName: 'Root',
                    custom: {},
                    hidden: false,
                    nodes: ['nodeId-0'],
                    linkedNodes: {}
                }
            })
        })
        it("gets craftNodes from source code using data", () => {
            const source1 = `
            import {View} from 'react-native';
            import {NativeInput as Input} from 'native-base';
            import Text from 'native-base'
            <View atr1="1" atr2={2} atr3 atr4={{background:"red"}}>
                <Input value="hello"/>
                <Text>hello</Text>
            </View>
            `
            const sourceNode = Source.parse(source1) // Source object
            const craftData = sourceNode.data(true)
            expect(craftData).toStrictEqual({
                "ROOT": {
                    "custom": {},
                    "displayName": "Root",
                    "hidden": false,
                    "isCanvas": true,
                    "linkedNodes": {},
                    "nodes": ["nodeId-0"],
                    "props": { "data-cy": "root-container" },
                    "type": { "resolvedName": "Root" }
                },
                "nodeId-0": {
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxElement",
                        "atr1": "StringLiteral",
                        "atr2": "JsxExpression",
                        "atr4": "JsxExpression",
                        "moduleSpecifier": "'react-native'",
                        "namedImportAlias": undefined,
                        "namedImportName": "View"
                    },
                    "displayName": "View",
                    "hidden": false,
                    "isCanvas": true,
                    "linkedNodes": {},
                    "nodes": ["nodeId-1", "nodeId-2"],
                    "parent": "ROOT",
                    "props": {
                        "_nodeId": "nodeId-0",
                        "atr1": "1",
                        "atr2": "{2}",
                        "atr4": "{{background:\"red\"}}"
                    },
                    "type": { "resolvedName": "View" }
                },
                "nodeId-1": {
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "_nodeType": "JsxSelfClosingElement",
                        "moduleSpecifier": "'native-base'",
                        "namedImportAlias": "Input",
                        "namedImportName": "NativeInput",
                        "value": "StringLiteral"
                    },
                    "displayName": "Input",
                    "hidden": false,
                    "isCanvas": true,
                    "linkedNodes": {},
                    "nodes": [],
                    "parent": "nodeId-0",
                    "props": {
                        "_nodeId": "nodeId-1",
                        "value": "hello"
                    },
                    "type": { "resolvedName": "Input" }
                },
                "nodeId-2": {
                    "custom": {
                        "_nodeId": "StringLiteral",
                        "children": "StringLiteral",
                        "_nodeType": "JsxElement",
                        "defaultImport": "Text",
                        "moduleSpecifier": "'native-base'"
                    },
                    "displayName": "Text",
                    "hidden": false,
                    "isCanvas": true,
                    "linkedNodes": {},
                    "nodes": [],
                    "parent": "nodeId-0",
                    "props": {
                        "_nodeId": "nodeId-2",
                        "children": "hello"
                    },
                    "type": { "resolvedName": "Text" }
                }
            })

        })
        it("dumps craftNodes back into source code", () => {
            // FIX: doesn't get {true?<Res/>:<Pas/>}
            const source1 = `<View atr1="1" atr2={2} atr3 atr4={{background:"red"}} children={MY_CHILDREN}><Box atr1={()=>{console.log('hello')}} atr2={VARIABLE1}></Box><Input children="protofie"/><Text>hello</Text></View>`
            const sourceFile1: Source = Source.parse(source1)
            let craftData1 = sourceFile1.data(true)
            const sourceFileTransformed1: string = sourceFile1.dump(craftData1, "my_components_dir")
            expect(sourceFileTransformed1).toBe(`<Root data-cy=root-container><View atr1="1" atr2={2} atr4={{background:"red"}}>{MY_CHILDREN}<Box atr1={()=>{console.log('hello')}} atr2={VARIABLE1}></Box><Input children="protofie"/><Text>hello</Text></View></Root>`
            )
        })
        it("dump importDeclarations", () => {
            const source1 = `import React, { useState, useEffect } from 'react' import {NativeBaseProvider} from 'native-base' import {View, Text, Platform as MyPlatform} from 'react-native'import Box from '@/components/Box' import Input from '@/components/Input'

                export const HomeScreen = () => {
                    return (<NativeBaseProvider theme={currentTheme}><View atr1="1" atr2={2} atr3 atr4={{background:"red"}} children={MY_CHILDREN}><Box atr1={()=>{console.log('hello')}} atr2={VARIABLE1}>{true?<Res/>:<Pas/>}</Box><Input children="protofie"/><Text>hello</Text></View></NativeBaseProvider>)
                }
            `
            const sourceFile1: Source = Source.parse(source1)
            let craftData1 = sourceFile1.data(true)
            craftData1 = Source.deleteCraftThemeNode(craftData1);
            // Add new element from uikit
            craftData1["newNode"] = {
                type: { resolvedName: 'MyAddedCustom' },
                isCanvas: true,
                props: { _nodeId: 'newNode' },
                displayName: 'AddedComponent',
                custom: {
                    _nodeType: 'JsxSelfClosingElement',
                    _nodeId: 'StringLiteral',
                    defaultImport: 'MyAddedCustom',
                    moduleSpecifier: "'@/components/MyAddedCustom'"
                },
                hidden: false,
                nodes: [],
                linkedNodes: {},
                parent: 'nodeId-1'
            }
            // update import info from nodeId-1
            craftData1['nodeId-1'] = {
                ...craftData1['nodeId-1'],
                custom: {
                    _nodeType: 'JsxSelfClosingElement',
                    _nodeId: 'StringLiteral',
                    defaultImport: 'View',
                    moduleSpecifier: "'@/components/View'"
                },
            }
            const newImportsContent = sourceFile1.dumpImportDeclarations(craftData1);
            expect(newImportsContent.replace(/[\t\n]/g, ' ')).toBe(`import React, { useState, useEffect } from 'react' import  { NativeBaseProvider } from 'native-base' import View from '@/components/View' import  { Text, Platform as MyPlatform } from 'react-native' import Box from '@/components/Box' import Input from '@/components/Input' import AddedComponent from '@/components/AddedComponent' `.replace(/[\t\n]/g, ' '))
        })
    })
})