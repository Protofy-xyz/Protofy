import fs from "fs";
import path from "path";
import Handlebars from "handlebars"

const root = path.join(process.cwd(), "..", "..");

function jsonToXml(json, nodeName = '', indent = '') {
  const indentStep = '    '; // 4 espacios para la indentación
  let xml = '';

  // Caso de valor primitivo o null
  if (typeof json !== 'object' || json === null) {
      if (nodeName) {
          // Abrimos la etiqueta en una línea, añadimos indentación y cerramos la etiqueta en otra línea
          return (
              `${indent}<${nodeName}>\n` +
              `${indent}${indentStep}${json}\n` +
              `${indent}</${nodeName}>\n`
          );
      } else {
          // Si no hay nodeName, simplemente devuelve el valor con su indentación
          return `${indent}${json}\n`;
      }
  }

  // Si es un array
  if (Array.isArray(json)) {
      // Verificamos si cada elemento es un objeto con una única clave y además tenemos nodeName
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
          // Caso general: cada elemento se procesa por separado
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
      // En el objeto raíz sin nodeName, generamos bloques independientes para cada clave
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

export const getPromptFromTemplate = async ({ templateName, ...vars }) => {
    const templateContent = fs.readFileSync(path.join(root, "data", "prompts", templateName + '.tpl'), "utf8");
    const templateFunction = Handlebars.compile(templateContent);
    const prompt = templateFunction(vars);
    // console.log(prompt);
    return prompt
}
