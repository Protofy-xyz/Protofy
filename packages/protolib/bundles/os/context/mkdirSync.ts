import fs from "fs";
export async function createPath(path) {
    const resultPayload = await fs.mkdirSync(path)
    return resultPayload
}
