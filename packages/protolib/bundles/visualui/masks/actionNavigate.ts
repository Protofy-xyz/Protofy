export const actionNavigate = {
    "id": "ActionNavigate",
    "title": "ActionNavigate",
    "path": "*",
    "type": "CallExpression",
    "filter": {
        "to": "uiContext.navigate"
    },
    "body": [
        {
            "type": "api",
            "data": { label: "route", field: "param-1", apiUrl: "/adminapi/v1/pages", list: "return res.route", selector: "items" }
        }
    ],
    "initialData": { to: 'uiContext.navigate', "param-1": { value: "", kind: "StringLiteral" } }
}