import Handlebars from "handlebars"
import { getLogger } from "../logger"

const logger = getLogger()

export const file = async (lib, path, vars) => {
    logger.info({template:{path, params: vars}}, "Template file executed")
    const apiPath = path
    if (lib.fs.existsSync(apiPath)) {
        throw "File already exists"
    }

    const templatePath = '../../' + vars?.data?.options?.template
    if (!vars?.data?.options?.template || !lib.fs.existsSync(templatePath)) {
        throw "There is a problem with your workspace definition. No template file was provided for this template."
    }

    const template = (await lib.fs.promises.readFile(templatePath)).toString()
    Handlebars.registerHelper('curlyBraces', function (options) {
        var content = options.fn(this)
        return "{{" + content + "}}";
    });
    const templateFunction = Handlebars.compile(template);
    const result = templateFunction({ name: vars.name, ...vars.data?.options?.variables });
    await lib.fs.promises.writeFile(apiPath, result)
    logger.info({template: apiPath}, "New file created with template file")
}
