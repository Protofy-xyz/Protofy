export const setCurrentView = {
    "id": "ChangeCurrentView",
    "title": "ChangeCurrentView",
    "path": "*",
    "type": "CallExpression",
    "filter": {
        "to": "setCurrentView"
    },
    "body": [
        {
            "type": "params",
            "params": [{ label: "change to", field: "param-1", type: "input", deleteable: false }]
        }
    ],
    "initialData": { to: 'setCurrentView', "param-1": { value: "default", kind: "StringLiteral" } }
}