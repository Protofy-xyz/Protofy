import { addCard } from "@extensions/cards/coreContext/addCard";
import { addAction } from '@extensions/actions/coreContext/addAction';
import { getServiceToken } from "protonode";

export const registerCards = async () => {
    addCard({
        group: 'board',
        tag: "iframe",
        id: 'board_iframe_show',
        templateName: "Display a link in an iframe",
        name: "show",
        defaults: {
            width: 4,
            height: 12,
            name: "Frame",
            icon: "monitor-stop",
            description: "Display a link in an iframe",
            type: 'value',
            html: `
// data contains: data.value, data.icon and data.color
return card({
  content: iframe({ src: \`\${data.value}\` }),
  padding: '3px'
});
`,
            editorOptions: {
                defaultTab: "value"
            },
        },
        emitEvent: true
    });

    addCard({
        group: 'board',
        tag: 'youtube',
        id: 'youtube',
        templateName: 'Display a YouTube video',
        name: 'board_youtube',
        defaults: {
            width: 3,
            height: 8,
            name: 'YouTube Video',
            icon: 'youtube',
            description: 'Embed a YouTube video from a URL',
            type: 'value',
            html: `
// data contains: data.value, data.icon and data.color
return card({
  content: youtubeEmbed({ url: \`\${data.value}\` }),
  padding: '3px'
});
`,
            editorOptions: {
                defaultTab: "value"
            },
        },
        emitEvent: true
    });


    addCard({
        group: 'board',
        tag: "image",
        id: 'image',
        templateName: "Display an image",
        name: "board_image",
        defaults: {
            width: 1,
            height: 4,
            name: "Image",
            icon: "image",
            description: "Display an image that scales without distortion",
            type: 'value',
            rulesCode: 'return `/public/vento-square.png`',
            html: `
// data contains: data.value, data.icon and data.color
return card({
  content: boardImage({ src: \`\${data.value}\` }),
  padding: '3px'
});
`,
            editorOptions: {
                defaultTab: "value"
            },
        },
        emitEvent: true
    });

    addCard({
        group: 'board',
        tag: 'markdown',
        id: 'board_markdown',
        templateName: 'Display markdown text',
        name: 'board_markdown',
        defaults: {
            width: 3,
            height: 12,
            name: 'Markdown',
            icon: 'file-text',
            description: 'Render formatted markdown using ReactMarkdown',
            type: 'value',
            html: "//@react\nreturn markdown(data)",
            rulesCode: "return `# h1 Heading 8-)\n## h2 Heading\n### h3 Heading\n#### h4 Heading\n##### h5 Heading\n###### h6 Heading\n\n## Tables\n\n| Option | Description |\n| ------ | ----------- |\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\nRight aligned columns\n\n| Option | Description |\n| ------:| -----------:|\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |`",
            editorOptions: {
                defaultTab: "value"
            },
        },
        emitEvent: true
    });

    addCard({
        group: 'board',
        tag: 'filebrowser',
        id: 'board_filebrowser',
        templateName: 'Display a file browser',
        name: 'view',
        defaults: {
            width: 5.5,
            height: 12,
            name: 'File Browser',
            icon: 'folder-search',
            description: 'Render a file browser',
            type: 'value',
            html: "return fileBrowser(data)",
            rulesCode: "return `/data/public`",
            editorOptions: {
                defaultTab: "value"
            },
        },
        emitEvent: true
    });

    addCard({
        group: 'memory',
        tag: 'object',
        id: 'memory_interactive_object',
        templateName: 'Interactive object',
        name: 'interactive',
        defaults: {
            name: 'object',
            icon: 'file-stack',
            width: 2,
            height: 12,
            description: 'Interactive object',
            type: 'action',
            editorOptions: {
                defaultTab: "value"
            },
            html: "reactCard(`\n  function Widget(props) {\n    console.log('react object widget: ', props.value)\n    return (\n      <Tinted>\n        <ViewObject\n          object={props.value}\n          onAdd={(key, value) => execute_action('${data.name}', { action: 'set', key, value })}\n          onValueEdit={(key, value) => execute_action('${data.name}', { action: 'set', key, value })}\n          onKeyDelete={(key) => execute_action('${data.name}', { action: 'delete', key })}\n          onKeyEdit={(oldKey, newKey) => execute_action('${data.name}', { action: 'rename', oldKey, newKey })}\n          onClear={() => execute_action('${data.name}', { action: 'reset' })}\n        />\n      </Tinted>\n    );\n  }\n`, data.domId, data)",
            displayResponse: true,
            rulesCode: "if (params.action === 'reset' || params.action === 'clear') {\r\n  return {};\r\n} else if (params.action === 'set') {\r\n  const key = params.key\r\n  const value = params.value\r\n  return { ...(board?.[name] ?? {}), [key]: value }\r\n} else if (params.action === 'delete') {\r\n  const newObj = { ...(board?.[name] ?? {}) }\r\n  delete newObj[params.key]\r\n  return newObj\r\n} else if (params.action === 'rename') {\r\n  const oldKey = params.oldKey\r\n  const newKey = params.newKey\r\n  const obj = { ...(board?.[name] ?? {}) }\r\n  if (oldKey !== newKey && obj[oldKey] !== undefined && obj[newKey] === undefined) {\r\n    obj[newKey] = obj[oldKey]\r\n    delete obj[oldKey]\r\n  }\r\n  return obj\r\n} else {\r\n  return board?.[name] ?? {}\r\n}",
            params: {
                key: "key",
                value: "value"
            },
            configParams: {
                key: {
                    visible: true,
                    defaultValue: ""
                },
                value: {
                    visible: true,
                    defaultValue: ""
                }
            },
            displayButton: false
        },
        emitEvent: true
    });

    addCard({
        group: 'memory',
        tag: 'queue',
        id: 'board_interactive_queue',
        templateName: 'Queue of items',
        name: 'interactive',
        defaults: {
            name: 'queue',
            icon: 'file-stack',
            width: 2,
            height: 12,
            description: 'Interactive queue of items',
            type: 'action',
            editorOptions: {
                defaultTab: "value"
            },
            html: "//@card/react\nfunction Widget(props) {\n  return (\n      <Tinted>\n          <ViewList \n            items={props.value} \n            onClear={(items) => execute_action(props.name, {action: 'clear'})}\n            onPush={(item) => execute_action(props.name, {action: 'push', item})}\n            onDeleteItem={(item, index) => execute_action(props.name, {action: 'remove', index})} \n          />\n      </Tinted>\n  );\n}\n",
            displayResponse: true,
            rulesCode: "if (params.action == 'reset') {\r\n    return [];\r\n} else if (params.action == 'pop') {\r\n    return (Array.isArray(board?.[name]) ? board?.[name] : []).slice(1);\r\n} else if (params.action == 'remove') {\r\n    const queue = Array.isArray(board?.[name]) ? board[name] : [];\r\n    const index = parseInt(params.index, 10);\r\n    return queue.slice(0, index).concat(queue.slice(index + 1));\r\n} else if(params.action == 'clear') {\r\n    return []\r\n} else {\r\n    return (Array.isArray(board?.[name]) ? board?.[name] : []).concat([params.item]);\r\n}",
            params: {
                item: "",
                action: "action to perform in the queue: push, pop, clear"
            },
            configParams: {
                item: {
                    visible: true,
                    defaultValue: ""
                },
                action: {
                    "visible": true,
                    "defaultValue": ""
                }
            },
            displayButton: false
        },
        emitEvent: true
    });


    addCard({
        group: 'memory',
        tag: 'matrix',
        id: 'board_interactive_matrix',
        templateName: 'Matrix grid',
        name: 'interactive',
        defaults: {
            name: 'matrix',
            icon: 'grid-3x3',
            width: 4,
            height: 12,
            description: "# Matrix / Grid\r\n\r\nCreates and manipulates bi-dimensional grids. The grid is stored as a bidimensional\r\narray where the first level is the row, and second level is the column.\r\n\r\n## Accessing a specific position given row and column\r\n\r\n```js\r\nmatrix[row][column]\r\n```\r\n\r\n## Actions\r\n\r\n### `reset`\r\n\r\nCreates a new matrix with the given dimensions and initializes all cells with a value.\r\n\r\n**Parameters:**\r\n\r\n* `action`: `\"reset\"`\r\n* `width`: number of columns (must be a positive integer)\r\n* `height`: number of rows (must be a positive integer)\r\n* `value`: initial value for all cells\r\n\r\n**Example:**\r\n\r\n```json\r\n{\r\n  \"action\": \"reset\",\r\n  \"width\": 3,\r\n  \"height\": 3,\r\n  \"value\": \"\"\r\n}\r\n```\r\n\r\n**Effect:**\r\nResets the matrix to a 3×3 grid with all cells initialized to an empty string (`\"\"`).\r\n\r\n---\r\n\r\n### `setCell`\r\n\r\nSets a specific cell at position `(x, y)` to the given value.\r\nCoordinates are 0-based: `x` is the column index, `y` is the row index.\r\n\r\n**Parameters:**\r\n\r\n* `action`: `\"setCell\"`\r\n* `x`: column index\r\n* `y`: row index\r\n* `value`: value to set in the specified cell\r\n\r\n**Example:**\r\n\r\n```json\r\n{\r\n  \"action\": \"setCell\",\r\n  \"x\": 1,\r\n  \"y\": 2,\r\n  \"value\": \"X\"\r\n}\r\n```\r\n\r\n**Effect:**\r\nSets the value `\"X\"` in the cell located at column 1, row 2.",
            type: 'action',
            editorOptions: {
                defaultTab: "value"
            },
            "rulesCode": "const matrix = board?.[name];\r\n\r\nif (params.action === 'reset') {\r\n  const width = params.width;\r\n  const height = params.height;\r\n  const initialValue = params.value;\r\n\r\n  if (!Number.isInteger(width) || width <= 0 ||\r\n      !Number.isInteger(height) || height <= 0) {\r\n    throw new TypeError('matrix reset error: width and height should positive numbers');\r\n  }\r\n\r\n  // Nueva matriz de height x width\r\n  return Array.from({ length: height }, () =>\r\n    Array.from({ length: width }, () => initialValue)\r\n  );\r\n} else {\r\n  if (!Array.isArray(matrix)) {\r\n    throw new Error('matrix set error: cannot set a value in an empty matrix');\r\n  }\r\n\r\n  const posX = params.x;\r\n  const posY = params.y;\r\n  const val = params.value;\r\n\r\n  if (!Number.isInteger(posY) || posY < 0 || posY >= matrix.length) {\r\n    throw new RangeError(`matrix set error: y out of range: ${posY}`);\r\n  }\r\n  const row = matrix[posY];\r\n  if (!Array.isArray(row)) {\r\n    throw new TypeError(`matrix set error: invalud row`);\r\n  }\r\n  if (!Number.isInteger(posX) || posX < 0 || posX >= row.length) {\r\n    throw new RangeError(`matrix set error x out of range: ${posX}`);\r\n  }\r\n\r\n  // Copia inmutable y set\r\n  const next = matrix.map(r => r.slice());\r\n  next[posY][posX] = val;\r\n  return next;\r\n}",
            "html": "//@card/react\n\nfunction MatrixTable({ data }) {\n  const rows = Array.isArray(data) ? data : []\n  const maxCols = rows.reduce((m, r) => Math.max(m, Array.isArray(r) ? r.length : 0), 0)\n\n  const wrapStyle = {\n    width: '100%',\n    height: '100%',\n    overflow: 'auto',\n  }\n  const tableStyle = {\n    borderCollapse: 'collapse',\n    width: '100%',\n    height: '100%',\n  }\n  const cellStyle = {\n    border: '1px solid #ccc',\n    padding: '6px 8px',\n    textAlign: 'center',\n  }\n\n  return (\n    <div style={wrapStyle}>\n      <table style={tableStyle}>\n        <tbody>\n          {rows.map((row, rIdx) => (\n            <tr key={rIdx}>\n              {Array.from({ length: maxCols }).map((_, cIdx) => {\n                const v = Array.isArray(row) ? row[cIdx] : undefined\n                const text = v == null ? '' : String(v)\n                return <td key={cIdx} style={cellStyle}><CardValue value={text ?? \"\"} /></td>\n              })}\n            </tr>\n          ))}\n        </tbody>\n      </table>\n    </div>\n  )\n}\n\nfunction Widget(card) {\n  const value = card.value;\n  const isMatrix = Array.isArray(value) && value.every(r => Array.isArray(r));\n  const fullHeight = value !== undefined && typeof value !== \"string\" && typeof value !== \"number\" && typeof value !== \"boolean\";\n\n  const content = (\n    <YStack f={1} h=\"100%\" miH={0} mt={fullHeight ? \"20px\" : \"0px\"} ai=\"stretch\" jc=\"flex-start\" width=\"100%\">\n      {card.icon && card.displayIcon !== false && (\n        <Icon name={card.icon} size={48} color={card.color} />\n      )}\n\n      {card.displayResponse !== false && (\n        isMatrix ? (\n          <YStack f={1} miH={0} width=\"100%\">\n            <MatrixTable data={value} />\n          </YStack>\n        ) : (\n          <YStack f={1} miH={0} width=\"100%\"><h1>{value !== undefined ? String(value) : 'Empty table'}</h1></YStack>\n        )\n      )}\n    </YStack>\n  );\n\n  return (\n    <Tinted>\n      <ProtoThemeProvider forcedTheme={window.TamaguiTheme}>\n        <ActionCard data={card} style={{ height: '100%'}}>\n          {card.displayButton !== false ? (\n            <ParamsForm data={card} style={{ height: '100%' }}>\n              {content}\n            </ParamsForm>\n          ) : (\n            card.displayResponse !== false && content\n          )}\n        </ActionCard>\n      </ProtoThemeProvider>\n    </Tinted>\n  );\n}",
            displayResponse: true,
            "params": {
                "x": "position  x only needed when using setCell",
                "y": "position y only needed when using setCell",
                "action": "reset or setCell",
                "value": "initialization value when using reset, value for cell when using setCell",
                "width": "width of the matrix: needed for reset",
                "height": "height of the matrix: needed for reset"
            },
            "configParams": {
                "x": {
                    "visible": true,
                    "defaultValue": "",
                    "type": "number"
                },
                "y": {
                    "visible": true,
                    "defaultValue": "",
                    "type": "number"
                },
                "action": {
                    "visible": true,
                    "defaultValue": "",
                    "type": "string"
                },
                "value": {
                    "visible": true,
                    "defaultValue": "",
                    "type": "string"
                },
                "width": {
                    "visible": true,
                    "defaultValue": "3",
                    "type": "number"
                },
                "height": {
                    "visible": true,
                    "defaultValue": "3",
                    "type": "number"
                }
            },
            displayButton: true,
            displayIcon: false
        },
        emitEvent: true
    });


    addCard({
        group: 'board',
        tag: "react",
        id: 'board_react',
        templateName: "Display a React component",
        name: "show",
        defaults: {
            width: 2,
            height: 8,
            name: "React",
            icon: "table-properties",
            description: "Display a React component",
            type: 'value',
            html: "reactCard(`\n  function Widget() {\n    return (\n        <Tinted>\n          <View className=\"no-drag\">\n            {/* you can use data.value here to access the value */}\n            <center><Text>Hello from react</Text></center>\n          </View>\n        </Tinted>\n    );\n  }\n\n`, data.domId)\n"
        },
        emitEvent: true
    })

    addCard({
        group: 'board',
        tag: "table",
        id: 'board_table_show',
        templateName: "Display an array of objects in a table",
        name: "show",
        defaults: {
            width: 3,
            height: 10,
            name: "Table",
            icon: "table-properties",
            description: "Display an array of objects in a table",
            type: 'value',
            html: "\n//data contains: data.value, data.icon and data.color\nreturn card({\n    content: cardTable(data.value), padding: '3px'\n});\n",
            rulesCode: "return [{name: \"protofito\", age: 20}, {name: \"protofita\", age: 19}, {name: \"bad protofito\", age: 10}]",
        },
        emitEvent: true
    })

    addAction({
        group: 'board',
        name: 'reset',
        url: "/api/core/v1/board/cardreset",
        tag: 'card',
        description: "Resets the value of a card in the board",
        params: {
            name: "the name of the card to reset"
        },
        emitEvent: true,
        receiveBoard: true,
        token: await getServiceToken()
    })

    addCard({
        group: 'board',
        tag: 'card',
        id: 'board_reset',
        templateName: 'Reset card value',
        name: 'board_reset',
        defaults: {
            type: "action",
            icon: 'message-square-text',
            name: 'card reset',
            description: 'Reset the value of a card in the board',
            params: {
                name: "Name of the card to reset"
            },
            rulesCode: `return await execute_action("/api/core/v1/board/cardreset", userParams)`,
            displayResponse: true,
            buttonLabel: "Reset card",
            displayIcon: false
        },
        emitEvent: true,
        token: await getServiceToken()
    })
}
