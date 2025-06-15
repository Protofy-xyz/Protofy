import fs from 'fs/promises'
import {join} from 'path'

export const listDir = async(options:{
    path: string, 
    done?: (list) => {}, 
    error?: (err) => {}
}) => {
    const path = options.path
    const done = options.done || (() => {})
    const error = options.error

    try {
        const list = await fs.readdir(join('../../', path))
        done(list)
        return list
    } catch(err) {
        if(error) {
            error(err)
        } else {
            throw err
        }
    }
}