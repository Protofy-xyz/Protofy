import Handlebars from "handlebars"

export const file = async (lib, path, vars) => {
    console.log('template file executed: ', vars, path)
    const apiPath = path
    if (lib.fs.existsSync(apiPath)) {
        throw "File already exists"
    }

    const templatePath = '../../' + vars?.data?.options?.template
    if (!vars?.data?.options?.template || !lib.fs.existsSync(templatePath)) {
        throw "There is a problem with your workspace definition. No template file was provided for this template."
    }

    const template = (await lib.fs.promises.readFile(templatePath)).toString()
    const templateFunction = Handlebars.compile(template);
    const result = templateFunction({ name: vars.name, ...vars.data?.options?.variables });
    await lib.fs.promises.writeFile(apiPath, result)
    console.log('New file created with template file: ', apiPath)
}
