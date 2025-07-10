import {flowSwitch} from "../context/switch";
import {forEach} from "../context/forEach";
import {filter} from "../context/filter";
import {map} from "../context/map";
import {split} from "../context/split";
import {join} from "../context/join";
import {rewire} from "../context/rewire";
import { push } from "../context/push";
import { jsonParse } from "../context/jsonParse";
import { toJson } from "../context/toJson";
import { addObjectKey } from "../context/addObjectKey";

export default {
    "switch": flowSwitch,
    forEach,
    filter,
    map,
    split,
    join,
    rewire,
    push,
    jsonParse,
    toJson,
    addObjectKey
}