import { generateUuid } from "./uuidGenerator";
import { validateUuid } from "./uuidValidator";
import { versionUuid } from "./uuidVersion";

export default {
    uuidGenerator: generateUuid,
    uuidValidator: validateUuid,
    uuidVersion: versionUuid
}