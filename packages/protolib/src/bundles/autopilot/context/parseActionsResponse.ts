import { getLogger } from "protobase";
import path from "path";

const root = path.join(process.cwd(), "..", "..");
const logger = getLogger();

export const parseActionsResponse = (response) => {
  let urls = [];
  if (response && response.choices && response.choices[0].message?.content?.includes("<actions>")) {
    const actions = response.choices[0].message.content.match(
      /<actions>([\s\S]*?)<\/actions>/
    )[1];

    // Extraer cada acción, permitiendo tanto <action name="..." /> como <action name="...">...</action>
    const actionMatches = [...actions.matchAll(/<action name="(.*?)"(?:>(.*?)<\/action>| *\/>)/gs)];

    actionMatches.forEach(([_, actionName, paramsBlock]) => {
      let params = {};

      // Si hay un bloque de parámetros, extraerlos
      if (paramsBlock) {
        params = [...paramsBlock.matchAll(/<param name="(.*?)">(.*?)<\/param>/g)]
          .reduce((acc, [_, paramName, paramValue]) => {
            acc[paramName] = paramValue;
            return acc;
          }, {});
      }

      // Convertir los parámetros a una string de query
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/api/v1/automations/${actionName}?${queryString}` : `/api/v1/automations/${actionName}`;

      urls.push(url);
    });
    return { content: response?.choices[0].message.content, urls: urls };
  } else {
    return { content: response?.choices[0].message.content, urls: [] };
  }
};