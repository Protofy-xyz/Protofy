import { handler, getRoot, getSourceFile, getDefinition, addObjectLiteralProperty, ImportType, getServiceToken, addImportToSourceFile, getPropertyValueFromObjectLiteral, addElementToArrayLiteral } from 'protonode'
import * as path from 'path'
import { API } from 'protobase';

const SnippetsDir = (root) => path.join(root, "/packages/app/bundles/custom/snippets/")
const indexFile = (root) => SnippetsDir(root) + "index.ts"
const indexFilePath = "/packages/app/bundles/custom/snippets/index.ts"

export const FlowAPI = (app, context) => {
  app.post('/adminapi/v1/flow/snippet', handler(async (req, res, session) => {
    const { name, code } = req.body;
    if (!name || !code) throw new Error("Error creating snippet, you must provide a name and the snippet code")
    // Create and save snippet 
    const tags = name.split(" ")?.filter(e => e != " ")?.map(v => `"${v}"`).join(", ");
    const result = await API.post('/adminapi/v1/templates/file?token=' + getServiceToken(), {
      name: name + '.ts',
      data: {
        options: { template: `/packages/protolib/src/bundles/flow/templates/snippet.tpl`, variables: { code, name, tags }},
        path: '/packages/app/bundles/custom/snippets'
      }
    })
    if (result.isError) {
      throw result.error?.error ?? result.error
    }
    // Add snippet to exported snippets
    const sourceFile = getSourceFile(indexFile(getRoot(req)))
    const arg = getDefinition(sourceFile, '"snippets"')
    if (!arg) {
      throw "No link definition schema marker found for file: " + path
    }
    const elemValue = getPropertyValueFromObjectLiteral(arg, 'api');
    addElementToArrayLiteral(elemValue, name + 'Snippet')
    addImportToSourceFile(sourceFile, name + 'Snippet', ImportType.DEFAULT, './' + name)
    sourceFile.saveSync();
    res.send('OK')
  }))
}

export default FlowAPI
