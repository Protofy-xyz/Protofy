export const setCurrentView = {
    "id": "ChangeView",
    "title": "ChangeView",
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