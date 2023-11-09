import { file } from "./file";

export const templates = {
    file
}

export const getTemplate = (name: string) => {
    return templates[name]
}