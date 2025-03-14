import { getPrompt, getPromptFromTemplate } from "./getPrompt";
import { fetchURLList } from "./fetchURLList";
import { parseActionsResponse } from "./parseActionsResponse";
import { autopilot } from "./autopilot";
import { action } from "./action";

export default {
    action,
    autopilot,
    getPrompt,
    getPromptFromTemplate,
    fetchURLList,
    parseActionsResponse
}