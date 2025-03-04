import { getLogger } from "protobase";
import path from "path";

const root = path.join(process.cwd(), "..", "..");
const logger = getLogger();

const processSkipActions = (urls) => {
  const processedUrls = [];

  for (let i = 0; i < urls.length; i++) {
      const currentUrl = urls[i];
      
      if (currentUrl.includes('/skip')) {
          const urlObject = new URL(currentUrl, 'http://dummy'); // Necesita dominio para parsear
          const params = new URLSearchParams(urlObject.search);

          const nextUrl = urls[i + 1];
          if (nextUrl) {
              // Copiar parámetros del skip al siguiente
              const nextUrlObject = new URL(nextUrl, 'http://dummy');
              const nextParams = new URLSearchParams(nextUrlObject.search);
              
              for (const [key, value] of params) {
                  nextParams.set(key, value);
              }
              
              // Reconstruir la siguiente URL con los parámetros combinados
              const combinedUrl = `${nextUrlObject.pathname}?${nextParams.toString()}`;
              processedUrls.push(combinedUrl);

              // Saltar al siguiente (porque lo acabamos de procesar aquí)
              i++;
          }
      } else {
          processedUrls.push(currentUrl);
      }
  }

  return processedUrls;
};


export const parseActionsResponse = (response) => {
  let urls = [];
  if (response && response.choices && response.choices[0].message?.content?.includes("<actions>")) {
      const actions = response.choices[0].message.content.match(
          /<actions>([\s\S]*?)<\/actions>/
      )[1];

      // Extraer cada acción, soportando:
      // 1. <action name="..." /> (con o sin otros atributos)
      // 2. <action name="..."> con <param>...</param> dentro
      const actionMatches = [...actions.matchAll(/<action([^>]*)>([\s\S]*?)<\/action>|<action([^>]*)\/>/g)];

      actionMatches.forEach(match => {
          const attrsBlock = match[1] || match[3] || ""; // atributos de la acción
          const paramsBlock = match[2] || ""; // contenido dentro de <action> (si es el formato largo)

          // Parsear los atributos directamente del tag <action>
          const attributeMatches = [...attrsBlock.matchAll(/(\w+)="(.*?)"/g)];
          const attributes = attributeMatches.reduce((acc, [_, key, value]) => {
              acc[key] = value;
              return acc;
          }, {});

          const actionName = attributes.name; // el name siempre debería existir
          if (!actionName) return; // por seguridad

          let params = { ...attributes }; // start with the attributes
          delete params.name; // el name no es un parámetro

          // Si hay un bloque de parámetros internos, añadirlos también (legacy support)
          if (paramsBlock) {
              const paramMatches = [...paramsBlock.matchAll(/<param name="(.*?)">(.*?)<\/param>/g)];
              paramMatches.forEach(([_, paramName, paramValue]) => {
                  params[paramName] = paramValue;
              });
          }

          // Convertir params a query string
          const queryString = new URLSearchParams(params).toString();
          const url = queryString ? `/api/v1/automations/${actionName}?${queryString}` : `/api/v1/automations/${actionName}`;

          urls.push(url);
      });

      return { content: response?.choices[0].message.content, urls: processSkipActions(urls) };
  } else {
      return { content: response?.choices[0].message.content, urls: [] };
  }
};