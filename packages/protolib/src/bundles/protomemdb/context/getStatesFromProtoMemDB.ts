import { API, StateElement, StateGroup } from "protobase";
import { ProtoMemDB } from "protobase";

export const getStatesFromProtoMemDB = async (tag, useRemoteAPI?): Promise<StateGroup> => {
    let states
    if(useRemoteAPI) {
        states = (await API.get("/api/v1/protomemdb/" + tag)).data
    } else {
        states = await ProtoMemDB.getByTag(tag);
    }
    
    
    const stateGroup = new StateGroup(Object.entries(states).map(([key, value]) => {
        return new StateElement(key, value);
    }), 'states');
    return stateGroup;
}