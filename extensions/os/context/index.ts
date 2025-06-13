import {childProcessSpawn} from "./childProcessSpawn";
import { writeFile } from "./writeFile";
import { existsSync } from "./existsSync";
import { createPath } from "./mkdirSync";

export default {
    spawn: childProcessSpawn,
    fileWriter: writeFile,
    pathExists: existsSync,
    createFolder: createPath
}