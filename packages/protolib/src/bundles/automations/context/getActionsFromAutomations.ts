import {Action, ActionGroup, API} from "protobase";

export const getActionsFromAutomations = async (token, tag) => {
    const endpoints = await (
        await API.get("/api/core/v1/automations?token=" + token + "&filter[tags]=" + tag)
    )

    const ag = new ActionGroup(endpoints.data.items.map((automation) => {
        return new Action(automation.name, automation.description, automation.automationParams);
    }), 'actions')

    return ag
};