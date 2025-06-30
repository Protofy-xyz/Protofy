import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Tinted } from "./Tinted";

export function Markdown({data}) {
  const text = data ?? '';
  return (
    <div className="no-drag markdown-body" style={{
      height: "100%",
      padding: "1em",
      overflow: "auto",
      fontFamily: "sans-serif",
      fontSize: "14px",
      color: "var(--color)",
      backgroundColor: "var(--bg-color)"
    }}>

      <Tinted>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </Tinted>
    </div>
  );
}