import { file } from "./file";
import { database } from "./database";

export const templates = {
    file,
    database
}

export const getTemplate = (name: string) => {
    return templates[name]
}