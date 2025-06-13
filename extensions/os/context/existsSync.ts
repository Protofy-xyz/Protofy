import fs from "fs";
export function existsSync(path) {
    const resultPayload = fs.existsSync(path)
    return resultPayload
}
