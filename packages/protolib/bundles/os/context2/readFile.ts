import fs from 'fs/promises'
import {join} from 'path'

export const readFile = async(options:{mode: 'text' | 'raw', path: string, done?: (content) => {}, error?: (err) => {}}) => {
    const path = options.path
    const done = options.done || (() => {})
    const error = options.error
    const mode = options.mode || 'text'

    try {
        const content = await fs.readFile(join('../../', path), mode === 'text' ? 'utf-8' : undefined)
        done(content)
        return content
    } catch(err) {
        if(error) {
            error(err)
        } else {
            throw err
        }
    }
}