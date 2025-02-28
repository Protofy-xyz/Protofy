import { StateElement, StateGroup } from "protobase";
import { ProtoMemDB } from "protobase";

export const getStatesFromProtoMemDB = async (tag): Promise<StateGroup> => {
    const states = await ProtoMemDB.getByTag(tag);
    const stateGroup = new StateGroup(Object.entries(states).map(([key, value]) => {
        return new StateElement(key, value);
    }));
    // console.log(stateGroup.toXmlString());
    return stateGroup;
}