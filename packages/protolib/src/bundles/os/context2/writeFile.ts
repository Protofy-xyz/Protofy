import fs from 'fs/promises'
import {join} from 'path'

export const writeFile = async(options:{
    path: string, 
    content: string | Buffer,
    mode?: 'text' | 'raw', 
    done?: () => {}, 
    error?: (err) => {}
}) => {
    const path = options.path
    const content = options.content
    const mode = options.mode || 'text'
    const done = options.done || (() => {})
    const error = options.error

    try {
        const result = await fs.writeFile(join('../../', path), content)
        done()
        return result
    } catch(err) {
        if(error) {
            error(err)
        } else {
            throw err
        }
    }
}