const icon = ({ name, size, color = 'var(--color7)', style = '' }) => {
    return `
        <div style="
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            mask-image: url(/public/icons/${name}.svg);
            -webkit-mask-image: url(/public/icons/${name}.svg);
            mask-repeat: no-repeat;
            -webkit-mask-repeat: no-repeat;
            mask-size: contain;
            -webkit-mask-size: contain;
            mask-position: center;
            -webkit-mask-position: center;
            ${style}
        "></div>
    `;
};

function jsonToDiv(json, indent, expandedDepth) {
    indent = indent || 0;
    expandedDepth = (expandedDepth === undefined) ? 2 : expandedDepth;

    var basePadding = 20;
    var baseFontSize = 14;
    var colors = {
        key: "var(--color10)",
        string: "var(--color7)",
        number: "#005cc5",
        boolean: "#e36209",
        null: "#6a737d",
        bracket: "#999"
    };

    function isObject(val) {
        return val && typeof val === "object" && !Array.isArray(val);
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function createDiv(content, level) {
        var padding = level * basePadding;
        return '<div style="padding-left:' + padding +
            'px; font-family: monospace; font-size:' + baseFontSize +
            'px;">' + content + "</div>";
    }

    function createCollapsible(header, content, closing, level, isExpanded) {
        var padding = level * basePadding;
        if (level === 0 && header === "" && closing === "") {
            // nivel 0 sin encabezado ni cierre (caso especial para objeto raíz sin llaves)
            return content;
        } else if (level === 0) {
            // nivel 0 pero sí con encabezado/cierre (ej: array raíz o fuerza)
            var headerHTML = '<div style="padding-left:' + padding +
                'px; font-family: monospace; font-size:' + baseFontSize +
                'px;">' + header + "</div>";
            var contentHTML = '<div style="display:block;">' + content + "</div>";
            var closingHTML = '<div style="padding-left:' + padding +
                'px; font-family: monospace; font-size:' + baseFontSize +
                'px;">' + closing + "</div>";
            return headerHTML + contentHTML + closingHTML;
        } else {
            var togglerIcon = isExpanded ? "-" : "+";
            var contentDisplay = isExpanded ? "block" : "none";
            var headerHTML =
                '<div style="padding-left:' + padding +
                'px; font-family: monospace; font-size:' + baseFontSize +
                'px;">' +
                '<span style="cursor:pointer;" onclick="(function(el){' +
                'var c = el.parentNode.nextElementSibling;' +
                "if(c.style.display==='none'){ c.style.display='block'; el.innerHTML='-'; }" +
                "else { c.style.display='none'; el.innerHTML='+'; }" +
                '})(this)">' +
                togglerIcon +
                "</span> " +
                header +
                "</div>";
            var contentHTML = '<div style="display:' + contentDisplay + ';">' +
                content + "</div>";
            var closingHTML =
                '<div style="padding-left:' + padding +
                'px; font-family: monospace; font-size:' + baseFontSize +
                'px;">' + closing + "</div>";
            return headerHTML + contentHTML + closingHTML;
        }
    }

    function process(value, level) {
        if (typeof value === "string") {
            if (level === 0) {
                return '<span style="color:' + colors.string + '">' + escapeHtml(value) + '</span>';
            }
            return '<span style="color:' + colors.string + '">"' + escapeHtml(value) + '"</span>';
        } else if (typeof value === "number") {
            return '<span style="color:' + colors.number +
                '">' + value + "</span>";
        } else if (typeof value === "boolean") {
            return '<span style="color:' + colors.boolean +
                '">' + value + "</span>";
        } else if (value === null) {
            return '<span style="color:' + colors.null +
                '">null</span>';
        } else {
            return render(value, level);
        }
    }

    function render(obj, level) {
        if (Array.isArray(obj)) {
            var isExpanded = level < expandedDepth;
            var inner = "";
            for (var i = 0; i < obj.length; i++) {
                inner += jsonToDiv(obj[i], level + 1, expandedDepth);
            }
            return createCollapsible(
                '<span style="color:' + colors.bracket + '">[</span>',
                inner,
                '<span style="color:' + colors.bracket + '">]</span>',
                level,
                isExpanded
            );
        } else if (isObject(obj)) {
            var isExpanded = level < expandedDepth;
            var inner = "";
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var keyHtml = '<span style="color:' + colors.key +
                        '">' + escapeHtml(key) + '</span>';
                    var valHtml = process(obj[key], level + 1);
                    inner += createDiv(keyHtml + ": " + valHtml, level + 1);
                }
            }

            // En nivel 0 no renderizamos llaves
            return createCollapsible(
                level === 0 ? "" : '<span style="color:' + colors.bracket + '">{</span>',
                inner,
                level === 0 ? "" : '<span style="color:' + colors.bracket + '">}</span>',
                level,
                isExpanded
            );
        } else {
            return createDiv(process(obj, level), level);
        }
    }

    var parsed;
    try {
        parsed = typeof json === "string" ? JSON.parse(json) : json;
    } catch (e) {
        parsed = json;
    }

    return '<div class="no-drag" style="border: 1px solid var(--gray7);border-radius: 10px;padding-top: 20px;flex:1;text-align:left; height:100%; background-color: var(--gray1);width: 100%; display:inline-block; white-space:pre-wrap;">' +
        render(parsed, indent) +
        "</div>";
}

const card = ({ content, style = '', padding = false, mode = 'normal' }) => {
    let padd = padding
    if (!padd) {
        if (mode === 'normal') {
            padd = '10px';
        } else if (mode === 'slim') {
            padd = '3px';
        }
    }
    return `
        <div style="
            height: 100%;
            width: 100%;
            padding: ${padd};
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            ${style}
        ">
            ${content}
        </div>
    `;
};

function cardTable(dataArray) {
    if (!Array.isArray(dataArray)) {
        return '<p>Input must be an array of objects</p>';
    }

    const allKeys = Array.from(
        new Set(dataArray.flatMap(item => Object.keys(item)))
    );

    let html = `
    <div style="height: 100%; overflow: auto; width: 100%;">
        <table style="
            border-collapse: collapse;
            width: 100%;
            font-family: sans-serif;
            font-size: 14px;
        ">
            <thead style="color: var(--color9); border-bottom: 1px solid var(--color6);">
                <tr>`;

    for (const key of allKeys) {
        html += `<th style="padding: 8px; text-align: left;">${key}</th>`;
    }

    html += `</tr></thead><tbody>`;

    dataArray.forEach((row, index) => {
        html += `<tr style="
                border-bottom: 1px solid var(--color6);
                transition: background-color 0.2s;
            "
            onmouseover="this.style.backgroundColor='var(--color2, rgba(0,0,0,0.05))'"
            onmouseout="this.style.backgroundColor='transparent'"
        >`;

        for (const key of allKeys) {
            let value = row[key];
            if (typeof value === 'object' && value !== null) {
                value = `<pre style="margin: 0; font-family: monospace; color: var(--color8);">${JSON.stringify(value, null, 2)}</pre>`;
            }
            html += `<td style="padding: 8px; vertical-align: top;">${value !== undefined ? value : ''}</td>`;
        }

        html += '</tr>';
    });

    html += '</tbody></table></div>';
    return html;
}



const iframe = ({ src }) => {
    return `<iframe style="width: 100%;height:100%;" src= "${src}" />`
}


const cardAction = ({ data }) => {
    const margin = 10;
    const allKeys = Object.keys(data.params || {});
    const longestKey = allKeys.reduce((acc, cur) => (
        cur.length > acc.length ? cur : acc
    ), '');
    const baseLabelWidth = longestKey.length * 8 + margin;
    return `
     <div style="
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    ">
        <form
            style="width: 100%; margin-top: 15px;"
            onsubmit='window.executeAction(event, "${data.name}")'
        >
            ${allKeys.map(key => {
        const cfg = data.configParams?.[key] || {};
        const { visible = true, defaultValue = '' } = cfg;
        const placeholder = data.params[key] ?? '';

        if (!visible) {
            return `
                            <input
                                type="hidden"
                                name="${key}"
                                value="${defaultValue}"
                            >
                        `;
        }

        return `
                        <div style="
                            display: flex; 
                            width: 100%; 
                            margin-bottom: 10px;
                            box-sizing: border-box;
                            flex-direction: column;
                        ">
                            <label style="
                                display: inline-block; 
                                font-weight: 500;
                                margin-left: 12px;
                                margin-bottom: 2px;
                                opacity: 0.7;
                                width: 100%;
                                font-size: 14px;
                                margin-right: 10px;
                                text-align: left;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            ">
                                ${key}
                            </label>
                            <input
                                class="no-drag"
                                type="text"
                                name="${key}"
                                style="
                                    background-color: var(--gray1);
                                    flex: 1;
                                    padding: 5px 10px;
                                    border: 0.5px solid var(--gray7);
                                    border-radius: 8px;
                                    box-sizing: border-box;
                                    min-width: 100px;
                                "
                                value="${defaultValue}"
                                placeholder="${placeholder}"
                            >
                        </div>
                    `;
    }).join('')
        }

            <button
                class="no-drag"
                type="submit"
                style="
                    width: 100%;
                    max-width: 100%;
                    padding: 10px;
                    text-align: center;
                    margin-top: 15px;
                    background-color: ${data.color};
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: filter 0.2s ease-in-out;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                "
                onmouseover="this.style.filter='brightness(1.05)'"
                onmouseout="this.style.filter='none'"
                onmousedown="this.style.filter='saturate(1.2) contrast(1.2) brightness(0.85)'"
                onmouseup="this.style.filter='brightness(1.05)'"
            >
                <a style="color: ${data.color};filter: brightness(0.5); font-weight: 400;">
                    ${data.layout?.buttonLabel ? data.layout.buttonLabel : "Run"}
                </a>
            </button>
        </form>

        <div 
            id="${data.name + '_response'}"
            style="
                overflow: auto;
                flex: 1;
                height: '100%';
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 30px;
                font-weight: bold;
                margin-top: 20px;
                white-space: pre-wrap:
            ">${jsonToDiv('', 0, 2)}</div>
        </div>

    </div>
    `;
};

const cardValue = ({ value, style = '' }) => {
    let fullHeight = false;
    //check if value is string, number or boolean
    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
        value = jsonToDiv(value);
        fullHeight = true;
    }
    return `
        <div style="
            height: ${fullHeight ? '100%' : 'auto'};
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            font-weight: bold;
            margin-top: 20px;
            white-space: pre-wrap;
            ${style}           
        ">${value}</div>
    `;
}

const reactCard = (jsx, root) => {
    // This is a hack to make react available in the boards html
    //iterate each key of window.ProtoComponents and add it to the global window object
    Object.keys(window.ProtoComponents || {}).forEach(key => {
        window[key] = window.ProtoComponents[key];
    });

    const jsxCode = `
  function WidgetRoot({children}) {
    return (
      <Provider disableRootThemeClass>
        {children}
      </Provider>
    );
  }

  ${jsx}

  const root = ReactDOM.createRoot(document.getElementById("${root}"));
  root.render(<WidgetRoot><Widget /></WidgetRoot>);
`;

    const compiled = Babel.transform(jsxCode, {
        presets: ['react'],
    }).code;

    eval(compiled);
}

const dataView = (object, root) => {
    return reactCard(`
  function InnerWidget(props) {
    const object = props.object
    const objExists = object ? true : false
    let objModel = null
    let apiUrl = null
    if (objExists) {
        objModel = ProtoModel.getClassFromDefinition(object)
        const { name, prefix } = objModel.getApiOptions()
        console.log("Object API options", { name, prefix })
        apiUrl = prefix + name
    }

    return <DataView
            disableRouting={true}
            sourceUrl={apiUrl}
            numColumnsForm={1}
            name={object?.name}
            model={objModel}
            hideFilters={false}
      />
  }

  function Widget() {
    return (
        <MqttWrapper>
            <Tinted>
            <View className="no-drag">
                {/* you can use data.value here to access the value */}
                <ObjectViewLoader widget={InnerWidget} object={"${object}Model"} />
            </View>
            </Tinted>
        </MqttWrapper>
    );
  }

`, root)
}

const getStates = () => {
    return window.protoStates || {};
}

const getActions = () => {
    return window.protoActions || {};
}
const getStorage = (modelName, key = null, defaultValue = {}) => {
    const currentState = getStates();

    const storage = currentState?.objects[modelName] ?? {}
    if (key) {
        return storage[key] ?? defaultValue;
    }
    return storage ?? defaultValue;
}

const getCardAspectRatio = (id) => {
    const div = document.getElementById(id)
    if (div) {
        const rect = div.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const aspectRatio = width / height;

        return aspectRatio
    }
    return 1
}

function useCardAspectRatio(id) {
  const [aspectRatio, setAspectRatio] = React.useState(1);

  React.useEffect(() => {
    const div = document.getElementById(id);
    if (!div) return;

    const heightError = 20; // margin top
    const updateAspectRatio = () => {
      const rect = div.getBoundingClientRect();
      if (rect.height !== 0) {
        setAspectRatio(rect.width / (rect.height-heightError));
      }
    };

    updateAspectRatio(); // calcular al montar

    const resizeObserver = new ResizeObserver(updateAspectRatio);
    resizeObserver.observe(div);

    return () => {
      resizeObserver.disconnect();
    };
  }, [id]);

  return aspectRatio;
}