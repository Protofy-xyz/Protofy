export const actionFetch = {
    "id": "ActionFetch",
    "title": "ActionFetch",
    "path": "*",
    "type": "CallExpression",
    "filter": {
        "to": "context.actionFetch"
    },
    "body": [
        {
            "type": "api",
            "data": { label: "url", field: "param-1", apiUrl: "api/v1/endpoints", list: "return res.path" }
        },
        {
            "type": "link",
            "data": {
                "text": "Need to create an API?",
                "url": "/admin/apis"
            }
        }
    ],
    "initialData": { to: 'context.actionFetch', "param-1": { value: "", kind: "StringLiteral" } }
}