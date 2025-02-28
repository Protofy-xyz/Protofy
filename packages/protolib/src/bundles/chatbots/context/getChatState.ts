import { API, getLogger } from "protobase";
import { StateElement, StateGroup } from "protobase";

export const getChatState = async (token: string, limit = 10) => {
    const chatContext = await API.get("/api/core/v1/events?filter[path]=message/create&itemsPerPage=" + limit + "&token=" + token);

    const chats = new StateGroup(chatContext.data.items.map((item) => {
        return new StateElement('message', "\nfrom: "+item.from+"\n"+ item.payload.message+"\n")
    }), true)

    const chatState = new StateGroup([new StateElement("chats", chats)]);
    return chatState;
}