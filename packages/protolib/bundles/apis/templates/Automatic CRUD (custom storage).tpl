//this is an Automatic LCRUD API with custom storage layer
//getDB provides iterator, get and put. 
//The storage layer used by generateApi/AutoAPI to interact with the storage
import {Objects} from "app/bundles/objects";
import {AutoAPI} from 'protolib/api'

const {name, prefix} = Objects.{{object}}.getApiOptions()

const {{capitalizedName}}API = AutoAPI({
    modelName: name,
    modelType: Objects.{{object}},
    initialDataDir: __dirname,
    prefix: prefix,
    getDB: (path, req, session) => {
        const db = {
            async *iterator() {
                let elements = [] 
                //TODO: recover your array of elements
                //elements = await API.call(...) or fs.readdir(...) or whaterver method you use to recover your objects
                for (const schema of schemas) {
                    yield [schema.id, JSON.stringify(schema)]; //yield each element, to generate an iterable
                }
            },

            async put(key, value) {
                //key is the key to store
                //value is a JSON encoded string to store in the record
                //value = JSON.parse(value) //decode if needed
                //TODO: store your value
            },

            async get(key) {
                let obj = {}
                //TODO: recover your object. Key is the string of the object key to be retrieved.
                //obj = await API.call(...) or fs.read(...) or whaterver method you use to read your objects
                return JSON.stringify(obj)
            }
        };

        return db;
    }
})

export default {{capitalizedName}}API