import {childProcessSpawn} from "./childProcessSpawn";
import { writeFile } from "./writeFile";
import { existsSync } from "./existsSync";

export default {
    spawn: childProcessSpawn,
    fileWriter: writeFile,
    pathExists: existsSync,
}