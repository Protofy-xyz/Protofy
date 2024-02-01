import {atom, useAtom} from 'jotai'
import {Source} from './models'

export function SourceAtomFactory(sourceCode: string) {
    const newSource = Source.new(sourceCode); 
    const sourceAtom = atom(newSource)
    return sourceAtom
}

export function useVisualUi(atom) {
    const [sourceCode, setSourceCode]: any = useAtom(atom);
    
    function ast(newAst: string) {
        setSourceCode((prev: any) => ({
            ...prev,
            ast: newAst
        }))
    }
    
    const setters = {
        ast 
    }
    return [sourceCode, setters]
}