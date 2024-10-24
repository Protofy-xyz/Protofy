export const navigate = {
    "id": "navigate",
    "title": "Navigate",
    "path": "*",
    "type": "CallExpression",
    "filter": {
        "to": "context.navigate"
    },
    "body": [
        {
            "type": "api",
            "data": { label: "route", field: "param-1", apiUrl: "/api/core/v1/pages", list: "return res.route", selector: "items" }
        }
    ],
    "initialData": { to: 'context.navigate', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "router", kind: "Identifier" } }
}