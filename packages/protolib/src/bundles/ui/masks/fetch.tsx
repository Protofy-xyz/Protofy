export const fetch = {
    "id": "Fetch",
    "title": "Fetch",
    "path": "*",
    "type": "CallExpression",
    "filter": {
        "to": "context.fetch"
    },
    "body": [
        {
            "type": "api",
            "data": { label: "url", field: "param-1", apiUrl: "api/v1/endpoints", list: "return res.path" }
        }
    ],
    "initialData": { to: 'context.fetch', "param-1": { value: "", kind: "StringLiteral" } }
}