import fs from "fs";
import path from "path";
import Handlebars from "handlebars"

const root = path.join(process.cwd(), "..", "..");

function jsonToXml(json, nodeName = '', indent = '') {
  const indentStep = '    '; // 4 espacios para indentación
  let xml = '';

  // Caso de valor primitivo o null
  if (typeof json !== 'object' || json === null) {
    if (nodeName) {
      return `${indent}<${nodeName}>${json}</${nodeName}>\n`;
    } else {
      return `${indent}${json}\n`;
    }
  }

  // Si es un array
  if (Array.isArray(json)) {
    // Si cada elemento es un objeto con una única clave y estamos dentro de una etiqueta (nodeName definida)
    const canMerge = json.every(
      item => typeof item === 'object' && item !== null && Object.keys(item).length === 1
    );
    if (canMerge && nodeName) {
      xml += `${indent}<${nodeName}>\n`;
      for (const item of json) {
        const key = Object.keys(item)[0];
        xml += jsonToXml(item[key], key, indent + indentStep);
      }
      xml += `${indent}</${nodeName}>\n`;
    } else {
      // Caso general: para cada elemento del array, se usa el mismo nodeName (o ninguno si no se define)
      for (const item of json) {
        xml += jsonToXml(item, nodeName, indent);
      }
    }
    return xml;
  }

  // Si es un objeto (no array)
  if (nodeName) {
    xml += `${indent}<${nodeName}>\n`;
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        xml += jsonToXml(json[key], key, indent + indentStep);
      }
    }
    xml += `${indent}</${nodeName}>\n`;
  } else {
    // Sin nodeName, se generan bloques independientes para cada clave (útil en el objeto raíz con varias claves)
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        xml += jsonToXml(json[key], key, indent);
      }
    }
  }

  return xml;
}

export const getPrompt = async ({ templateName, actions, states }) => {
  const templateContent = fs.readFileSync(path.join(root, "data", "prompts", templateName + '.tpl'), "utf8");
  const templateFunction = Handlebars.compile(templateContent);
  const prompt = templateFunction({ actions: jsonToXml(actions.getData()), states: jsonToXml(states.getData()) });
  // console.log(prompt);
  return prompt
}

