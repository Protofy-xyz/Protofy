import Editor from '@monaco-editor/react'

type Props = {
    sourceCode: string,
    onChange: any
}
const Monaco = ({ sourceCode, onChange }: Props) => {

    return (
        <Editor
            theme='vs-dark'
            defaultLanguage='javascript'
            value={sourceCode}
            onMount={onChange}
        />
    )
}

export default Monaco