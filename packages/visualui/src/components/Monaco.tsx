import React from 'react';
import Editor from '@monaco-editor/react'
import useKeypress from 'react-use-keypress';

type Props = {
    sourceCode: string,
    onChange: any,
    onSave?:  any
    onEscape?: any
}
const Monaco = ({ sourceCode, onChange, onSave, onEscape }: Props) => {
    if (onSave) {
        useKeypress(['s', 'S'], (event) => {
            if ((event.key == "s" || event.key == "S") && (event.ctrlKey || event.metaKey)) { // Save
                if (!onSave) return
                event.preventDefault();
                return onSave()
            }
        })
    }
    if (onEscape) {
        useKeypress(['Escape'], (event) => {
            if ((event.key == "Escape")) {
                if (!onEscape) return
                event.preventDefault();
                return onEscape()
            }
        })
    }
    return (
        <Editor
            theme='vs-dark'
            defaultLanguage='javascript'
            value={sourceCode}
            onChange={(val) => onChange(val)}
        />
    )
}

export default Monaco