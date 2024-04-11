export const actionNavigate = {
    "id": "ActionNavigate",
    "title": "ActionNavigate",
    "path": "*",
    "type": "CallExpression",
    "filter": {
        "to": "actions.navigate"
    },
    "body": [
        {
            "type": "params",
            "params": [{ label: 'route', field: 'param-1', type: 'input' }]
        }
    ],
    "initialData": { to: 'actions.navigate', "param-1": { value: "", kind: "StringLiteral" } }
}