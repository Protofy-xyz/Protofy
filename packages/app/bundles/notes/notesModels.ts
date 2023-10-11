import { NoteSchema, NoteType } from "./notesSchemas"
import { SessionDataType } from 'protolib/api/lib/session'
import { ProtoModel, ProtoCollection } from 'protolib/base'

export class NoteModel extends ProtoModel<NoteModel> {
    constructor(data: NoteType, session?: SessionDataType) {
        super(data, NoteSchema, session);
    }

    protected static _newInstance(data: any, session?: SessionDataType): NoteModel {
        return new NoteModel(data, session);
    }
}

export class NoteCollection extends ProtoCollection<NoteModel> {
    constructor(models: NoteModel[]) {
        super(models)
    }
}