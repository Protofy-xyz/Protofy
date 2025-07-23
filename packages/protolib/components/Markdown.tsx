import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Tinted } from "./Tinted";
import { useEffect, useRef, useState } from "react";
import { Monaco } from "./Monaco";
import { useThemeSetting } from '@tamagui/next-theme'
import useKeypress from 'react-use-keypress';

export function Markdown({ data, readOnly = false, setData }) {
  const text = data ?? '';
  const [editing, setEditing] = useState(false);
  const { resolvedTheme } = useThemeSetting();

  const code = useRef(text);

  useEffect(() => {
    if (data) {
      code.current = data;
    }
  }, [data]);


  useKeypress(['Escape'], (event) => {
    if (editing) {
      setData(code.current);
      setEditing(false);
      event.preventDefault();
    }
  })
  return (
    <div onClick={() => { !readOnly && !editing && setEditing(!editing) }} className="no-drag markdown-body" style={{
      height: "100%",
      padding: "1em",
      overflow: "auto",
      fontFamily: "sans-serif",
      fontSize: "14px",
      color: "var(--color)",
      backgroundColor: "var(--bg-color)",
    }}>
      {editing && <Monaco
        height={"100%"}
        path={data.id + '_markdown.md'}
        darkMode={resolvedTheme === 'dark'}
        sourceCode={code.current}
        onChange={(newCode) => {
          code.current = newCode;
        }}
        options={{
          folding: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          lineNumbers: false,
          minimap: { enabled: false },
          suggestOnTriggerCharacters: false,
          quickSuggestions: false,
          wordBasedSuggestions: false,
          parameterHints: { enabled: false },
          tabCompletion: 'off'
        }}
      />}
      {!editing && <Tinted>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </Tinted>}
    </div>
  );
}