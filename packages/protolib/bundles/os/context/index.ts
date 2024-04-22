import {childProcessSpawn} from "./childProcessSpawn";
import { writeFile } from "./writeFile";


export default {
    spawn: childProcessSpawn,
    fileWriter: writeFile,
}