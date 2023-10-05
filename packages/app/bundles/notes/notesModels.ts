import { NoteSchema, NoteType } from "./notesSchemas"

export class NoteModel {
    data: NoteType
    constructor(data: NoteType) {
        this.data = data
    }

    getId() {
        return this.data.id
    }

    setId(id: string) {
        return new NoteModel({
            ...this.data,
            id: id
        })
    }

    //generates a new notemodal with a generated id
    generateId() {
        return new NoteModel({
            ...this.data,
            id: ""+Math.random()
        })
    }

    //true if deleted, false otherwise
    isDeleted() {
        return this.data._deleted ? true : false
    }

    //get data to appear on list
    list() {
        return this.read()
    }

    //called when the note is created in the server
    create() {
        return this.generateId().validate()
    }

    //get data from storage to client
    read() {
        return this.data
    }

    //asks for an update, can throw or change things
    update(updatedNote: NoteModel) {
        return updatedNote.setId(this.getId()) //accept the update, but keep our id
    }

    //asks for deletion, can throw to avoid deletion
    delete() {
        return new NoteModel({
            ...this.data,
            _deleted: true
        })
    }

    //validate model
    validate() {
        NoteSchema.parse(this.data) //validate
        return this
    }

    //called when being dumped to storage
    serialize() {
        return JSON.stringify(this.data)
    }

    //called when being recovered from storage
    static unserialize(data:string) {
        return new NoteModel(JSON.parse(data))
    }

    //get raw data
    getData() {
        return this.data
    }

    static load(data: NoteType) {
        return new NoteModel(data)
    }
}

export class NoteCollection {
    notes: NoteModel[]

    constructor(notes: NoteModel[]) {
        this.notes = notes
    }

    static load (notesData: NoteType[]) {
        return new NoteCollection(notesData.map(noteData => new NoteModel(noteData)))
    }

    getData() {
        return this.notes.map(note => note.getData())
    }

    filter(fn: (value: NoteModel, index: number, array: NoteModel[]) => value is NoteModel) {
        return new NoteCollection(this.notes.filter(fn))
    }
}