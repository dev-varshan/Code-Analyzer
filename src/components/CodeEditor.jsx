import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

const HIGHLIGHT_TIMEOUT = 2000; // 2 seconds

const CodeEditor = ({ code, setCode, highlightLine }) => {
  const editorRef = useRef(null);
  const decorationRef = useRef([]);
  const timeoutRef = useRef(null);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (!editorRef.current || !highlightLine) return;

    const editor = editorRef.current;

    // Clear any previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Scroll to line
    editor.revealLineInCenter(highlightLine);

    // Apply highlight
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

    // Auto-remove highlight after timeout
    timeoutRef.current = setTimeout(() => {
      decorationRef.current = editor.deltaDecorations(
        decorationRef.current,
        []
      );
    }, HIGHLIGHT_TIMEOUT);

    // Cleanup on unmount or next highlight
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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
