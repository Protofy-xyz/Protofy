import Console from "./Console";
import SetTimeout from "./SetTimeout";
import { filterCallback, restoreCallback } from "../../lib/Mask";
import SetInterval from "./SetInterval";
import Map from "./Map";
import Filter from "./Filter";
import Find from "./Find";
import Reduce from "./Reduce";
import Fetch from "./Fetch";

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
        "type": "params",
        "params": [
          { label: "url", field: "param1", type: "input" }
        ],
      },
      {
        "type": "link",
        "data": {
          "text": "Need to create an API?",
          "url": "/admin/apis"
        }
      }
    ],
    "initialData": { to: 'actionFetch', param1: '"adminapi/v1/apis"' }
  },
  // {
  //   id: 'Console',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('console.'),
  //   getComponent: Console,
  //   getInitialData: () => { return { to: 'console.log', param1: '"Hello World"' } }
  // },
  // {
  //   id: 'SetTimeout',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => {
  //     var astNode = nodeData?._astNode
  //     var additionalCheck = astNode ? getMaskFromCodeCheck(astNode) : true
  //     return (
  //       node.type == "CallExpression"
  //       && nodeData.to == 'setTimeout'
  //       && nodeData.param1.startsWith("() =>")
  //       && additionalCheck
  //     )
  //   },
  //   getComponent: SetTimeout,
  //   filterChildren: filterCallback("1"),
  //   restoreChildren: restoreCallback("1"),
  //   getInitialData: () => { return { to: 'setTimeout', param2: '1000', param1: "() =>" } }
  // },
  // {
  //   id: 'SetInterval',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => {
  //     var astNode = nodeData?._astNode
  //     var additionalCheck = astNode ? getMaskFromCodeCheck(astNode) : true
  //     return (
  //       node.type == "CallExpression"
  //       && nodeData.to == 'setInterval'
  //       && nodeData.param1.startsWith("() =>")
  //       && additionalCheck
  //     )
  //   },
  //   getComponent: SetInterval,
  //   filterChildren: filterCallback("1"),
  //   restoreChildren: restoreCallback("1"),
  //   getInitialData: () => { return { to: 'setInterval', param2: '1000', param1: "() =>" } }
  // },
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
  // {
  //   id: 'Fetch',
  //   type: 'CallExpression',
  //   check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('fetch'),
  //   getComponent: Fetch,
  //   getInitialData: () => { return { to: 'fetch', param1: '"/cloudapi/v1/"' } }
  // }
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