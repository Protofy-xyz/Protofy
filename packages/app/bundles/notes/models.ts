import { NoteSchema, NoteType } from "./schemas"

export class NoteModel {
    data: NoteType
    constructor(data: NoteType) {
        NoteSchema.parse(data) //validate
        this.data = data
    }

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