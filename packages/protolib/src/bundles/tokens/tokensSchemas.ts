import { z, Schema, AutoModel } from "protobase";
/*
{
  "id": "admin@protofy.xyz",
  "type": "admin",
  "admin": true,
  "permissions": [
    "*",
    "admin"
  ],
  "iat": 1730316122,
  "exp": 1733916122
}
*/
export const TokenSchema = Schema.object({
	  id: z.string().label("Token ID"),
    type: z.string(),
    admin: z.boolean(),
    permissions: z.array(z.string()),
    iat: z.number(),
    exp: z.number()
})

export type TokenType = z.infer<typeof TokenSchema>;
export const TokenModel = AutoModel.createDerived<TokenType>("TokenModel", TokenSchema);
