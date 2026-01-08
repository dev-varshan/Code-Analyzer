import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, setCode, highlightLine }) => {
  const editorRef = useRef(null);
  const decorationRef = useRef([]);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (!editorRef.current || !highlightLine) return;

    const editor = editorRef.current;

    // Scroll to line
    editor.revealLineInCenter(highlightLine);

    // Highlight line
    decorationRef.current = editor.deltaDecorations(
      decorationRef.current,
      [
        {
          range: new window.monaco.Range(
            highlightLine,
            1,
            highlightLine,
            1
          ),
          options: {
            isWholeLine: true,
            className: "monaco-line-highlight",
          },
        },
      ]
    );
  }, [highlightLine]);

  return (
    <Editor
      height="100%"
      language="python"
      theme="vs-dark"
      value={code}
      onChange={(value) => setCode(value)}
      onMount={handleEditorMount}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
      }}
    />
  );
};

export default CodeEditor;
