export const jsonToDivCode = `
function jsonToDiv(json, indent, expandedDepth, inside) {
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
    var padding = Math.max(0, level-1) * basePadding;
    return '<div style="padding-left:' + padding +
      'px; font-family: monospace; font-size:' + baseFontSize +
      'px;">' + content + "</div>";
  }

  function createCollapsible(header, content, closing, level, isExpanded) {
    var padding = Math.max(0, level-1) * basePadding;
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
      if(level === 0) {
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
            var value = obj[i];
            var isPrimitive = (
                typeof value === "string" ||
                typeof value === "number" ||
                typeof value === "boolean"
            );

            var bullet = isPrimitive ? '<span style="color:' + colors.key + '">-</span> ' : '';
            var item = render(value, level + 1);

            // si es primitivo, extraemos el contenido del div
            if (isPrimitive && item.startsWith('<div')) {
                const firstClose = item.indexOf('>') + 1;
                const lastOpen = item.lastIndexOf('<');
                item = item.slice(firstClose, lastOpen);
                inner += createDiv(bullet + item, level + 1);
            } else {
                // si no es primitivo, ya está indentado y estructurado
                inner += item;
            }
        }
        return createCollapsible(
            level === 0 ? "" : '<span style="color:' + colors.bracket + '">[</span>',
            inner,
            level === 0 ? "" : '<span style="color:' + colors.bracket + '">]</span>',
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

  const extraStyle = !inside ? "overflow:auto; border: 1px solid var(--gray7);border-radius: 10px;padding:10px;background-color: var(--gray1);flex:1;" : ""
  return '<div class="no-drag" style="'+extraStyle+'text-align:left; width: 100%; display:inline-block; white-space:pre-wrap;">' +
    render(parsed, indent) +
    "</div>";
}
`

let _jsonToDivFn;

export function jsonToDiv(json, indent, expandedDepth) {
    if (!_jsonToDivFn) {
        _jsonToDivFn = new Function(jsonToDivCode + "; return jsonToDiv;")();
      }
    return _jsonToDivFn(json, indent, expandedDepth);

}