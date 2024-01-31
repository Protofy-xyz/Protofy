import {atom} from 'jotai'
import {Source} from './models'

export function SourceAtomFactory(sourceCode: string) {
    const newSource = Source.new(sourceCode); 
    return atom(newSource)
}