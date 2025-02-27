import fs from "fs";
import path from "path";
import Handlebars from "handlebars"

const root = path.join(process.cwd(), "..", "..");

export const getPrompt = async ({templateName, actions, states, rules}) => {
  const templateContent = fs.readFileSync(path.join(root, "data", "prompts",  templateName+'.tpl'), "utf8");
  const templateFunction = Handlebars.compile(templateContent);
  const prompt = templateFunction({actions: actions.toXmlString(), states: states.toXmlString(), rules: "<rules>"+rules.join("\n")+"</rules>"});
  // console.log(prompt);
  return prompt
}

