import {Action, ActionGroup, API} from "protobase";

export const getActionsFromAutomations = async (tag, token?) => {
    const endpoints = await (
        await API.get("/api/core/v1/automations?"+(token ? "token=" + token + "&" : "")+"filter[tags]=" + tag)
    )

    const ag = new ActionGroup(endpoints.data.items.map((automation) => {
        return new Action(automation);
    }), 'actions')

    return ag
};