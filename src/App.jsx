import { useState, useEffect, useMemo, useRef } from "react";
import CodeEditor from "./components/CodeEditor";
import FindingsPanel from "./components/FindingsPanel";
import { runRealtimeAnalysis } from "./analysis/runRealtimeAnalysis";
import { debounce } from "./utils/debounce";
import "./App.css";

function App() {
  const [code, setCode] = useState(`# Write Python code here
user_input = input()
eval(user_input)
`);

  const [realtimeFindings, setRealtimeFindings] = useState([]);

  // ---- RESIZE STATE ----
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [editorWidth, setEditorWidth] = useState(75); // %

  // ---- DEBOUNCED ANALYSIS ----
  const debouncedAnalysis = useMemo(
    () =>
      debounce((code) => {
        const results = runRealtimeAnalysis(code);
        setRealtimeFindings(results);
        console.log("🔎 Realtime Analysis Findings:", results);

      }, 500),
    []
  );

  useEffect(() => {
    debouncedAnalysis(code);
  }, [code, debouncedAnalysis]);

  // ---- MOUSE HANDLERS ----
  const onMouseDown = () => {
    isDraggingRef.current = true;
  };

  const onMouseMove = (e) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newEditorWidth = ((e.clientX - rect.left) / rect.width) * 100;

    // Limit resize (prevent collapse)
    if (newEditorWidth > 40 && newEditorWidth < 85) {
      setEditorWidth(newEditorWidth);
    }
  };

  const onMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <>
      {/* Header unchanged */}
      <header className="app-header">
        <h2 className="app-title">Secure Python Code Analyzer</h2>
      </header>

      {/* Main Layout */}
      <main
        ref={containerRef}
        className="editor-container"
        style={{
          display: "flex",
          height: "calc(100vh - 60px)",
          userSelect: isDraggingRef.current ? "none" : "auto",
        }}
      >
        {/* Code Editor */}
        <div style={{ width: `${editorWidth}%` }}>
          <CodeEditor code={code} setCode={setCode} />
        </div>

        {/* RESIZER BAR */}
        <div
          onMouseDown={onMouseDown}
          style={{
            width: "5px",
            cursor: "col-resize",
            background: "#333",
          }}
        />

        {/* Findings Panel */}
        <div
          style={{
            width: `${100 - editorWidth}%`,
            borderLeft: "1px solid #333",
            background: "#141414",
            overflowY: "auto",
          }}
        >
          <FindingsPanel findings={realtimeFindings} />
        </div>
      </main>
    </>
  );
}

export default App;
