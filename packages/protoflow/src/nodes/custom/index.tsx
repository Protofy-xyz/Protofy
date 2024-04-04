import { filterCallback, restoreCallback } from "../../lib/Mask";
import Map from "./Map";
import Filter from "./Filter";
import Find from "./Find";
import Reduce from "./Reduce";

const getMaskFromCodeCheck = (ast) => {
  const param1 = ast?.getArguments ? ast?.getArguments()[0] : null
  const isArrow = param1?.getKindName() == 'ArrowFunction'
  const isValidBody = param1?.getBody ? !['PropertyAccessExpression', 'Identifier', 'NumericLiteral'].includes(param1?.getBody()?.getKindName()) : false
  return (isArrow && isValidBody)
}

export const BaseJSMasks = [
  {
    "id": "ActionFetch",
    "title": "ActionFetch",
    "path": "*",
    "type": "CallExpression",
    "filter": {
      "to": "actionFetch"
    },
    "body": [
      {
        "type": "api",
        "data": { label: "url", field: "param1", apiUrl: "api/v1/endpoints", list: "return `'` + res.path + `'`" }
      },
      {
        "type": "link",
        "data": {
          "text": "Need to create an API?",
          "url": "/admin/apis"
        }
      }
    ],
    "initialData": { to: 'actionFetch', param1: '' }
  },

  // {
  //   id: 'Map',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => {
  //     var astNode = nodeData?._astNode
  //     var additionalCheck = astNode ? getMaskFromCodeCheck(astNode) : true
  //     return (
  //       node.type == "CallExpression" 
  //       && nodeData.to?.endsWith('.map')
  //       && nodeData.param1.startsWith("(item,i,) =>")
  //       && additionalCheck
  //       )
  //   },
  //   getComponent: Map,
  //   filterChildren: filterCallback("1"),
  //   restoreChildren: restoreCallback("1"),
  //   getInitialData: () => { return { to: '.map', param1: "(item,i,) =>" } }
  // },
  // {
  //   id: 'Filter',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => {
  //     var astNode = nodeData?._astNode
  //     var additionalCheck = astNode ? getMaskFromCodeCheck(astNode) : true
  //     return (
  //       node.type == "CallExpression" 
  //       && nodeData.to?.endsWith('.filter')
  //       && nodeData.param1.startsWith("(item,i,) =>")
  //       && additionalCheck
  //       )
  //   },
  //   getComponent: Filter,
  //   filterChildren: filterCallback("1"),
  //   restoreChildren: restoreCallback("1"),
  //   getInitialData: () => { return { to: '.filter', param1: "(item,i,) =>" } }
  // },
  // {
  //   id: 'Find',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => {
  //     var astNode = nodeData?._astNode
  //     var additionalCheck = astNode ? getMaskFromCodeCheck(astNode) : true
  //     return (
  //       node.type == "CallExpression" 
  //       && nodeData.to?.endsWith('.find')
  //       && nodeData.param1.startsWith("(item,i,) =>")
  //       && additionalCheck
  //       )
  //   },
  //   getComponent: Find,
  //   filterChildren: filterCallback("1"),
  //   restoreChildren: restoreCallback("1"),
  //   getInitialData: () => { return { to: '.find', param1: "(item,i,) =>" } }
  // },
  // {
  //   id: 'Reduce',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => { 
  //     var astNode = nodeData?._astNode
  //     var additionalCheck = astNode ? getMaskFromCodeCheck(astNode) : true
  //     return (
  //     node.type == "CallExpression"
  //     && nodeData.to?.endsWith('.reduce')
  //     && nodeData.param1.startsWith("(total,item,i,) =>")
  //     && additionalCheck
  //   )},
  //   getComponent: Reduce,
  //   filterChildren: filterCallback("1"),
  //   restoreChildren: restoreCallback("1"),
  //   getInitialData: () => { return { to: '.reduce', param1: "(total,item,i,) =>", param2: "" } }
  // },
]

const getCustomComponent = (node, nodeData, customComponents) => {
  if (!node) return null
  const customComponent = customComponents?.find(c => c.check(node, nodeData))
  if (customComponent) {
    return customComponent
  }
  return null
}

export default getCustomComponent;