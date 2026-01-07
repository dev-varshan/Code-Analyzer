import { useState, useEffect, useMemo, useRef } from "react";
import CodeEditor from "./components/CodeEditor";
import FindingsPanel from "./components/FindingsPanel";
import ScanButton from "./components/ScanButton";
import ApiKeyModal from "./components/ApiKeyModal";
import { runRealtimeAnalysis } from "./analysis/runRealtimeAnalysis";
import { runFullScan } from "./analysis/runFullScan";
import { debounce } from "./utils/debounce";
import "./App.css";

function App() {
  const [code, setCode] = useState(`# Write Python code here
user_input = input()
eval(user_input)
`);

  const [realtimeFindings, setRealtimeFindings] = useState([]);
  const [fullScanFindings, setFullScanFindings] = useState([]);

  // 🔑 AI API KEY (BYOK)
  const [apiKey, setApiKey] = useState(null);
  const [showApiModal, setShowApiModal] = useState(false);

  // ---- RESIZE STATE ----
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [editorWidth, setEditorWidth] = useState(75);

  // ---- DEBOUNCED REALTIME ANALYSIS ----
  const debouncedAnalysis = useMemo(
    () =>
      debounce((code) => {
        const results = runRealtimeAnalysis(code);
        setRealtimeFindings(results);
      }, 500),
    []
  );

  useEffect(() => {
    debouncedAnalysis(code);
  }, [code, debouncedAnalysis]);

  // ---- FULL SCAN HANDLER ----
  const handleFullScan = () => {
    const results = runFullScan(code);
    setFullScanFindings(results);
  };

  // ---- MOUSE HANDLERS ----
  const onMouseDown = () => {
    isDraggingRef.current = true;
  };

  const onMouseMove = (e) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newEditorWidth = ((e.clientX - rect.left) / rect.width) * 100;
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
  window.__AI_API_KEY__ = apiKey;
window.__FULL_CODE__ = code;


  return (
    <>
      <header className="app-header">
        <h2 className="app-title">Secure Python Code Analyzer</h2>

        {/* 🔑 AI KEY BUTTON */}
        <button
          onClick={() => setShowApiModal(true)}
          style={{
            marginLeft: "auto",
            marginRight: "16px",
            background: apiKey ? "#52c41a" : "#333",
            color: "#fff",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          {apiKey ? "AI Key Added" : "Add AI Key"}
        </button>
      </header>

      <main
        ref={containerRef}
        className="editor-container"
        style={{
          display: "flex",
          height: "calc(100vh - 60px)",
          userSelect: isDraggingRef.current ? "none" : "auto",
        }}
      >
        <div style={{ width: `${editorWidth}%` }}>
          <ScanButton onScan={handleFullScan} />
          <CodeEditor code={code} setCode={setCode} />
        </div>

        <div
          onMouseDown={onMouseDown}
          style={{
            width: "5px",
            cursor: "col-resize",
            background: "#333",
          }}
        />

        <div
          style={{
            width: `${100 - editorWidth}%`,
            borderLeft: "1px solid #333",
            background: "#141414",
            overflowY: "auto",
          }}
        >
          <FindingsPanel
            findings={realtimeFindings}
            fullScanFindings={fullScanFindings}
          />
        </div>
      </main>

      {/* 🔑 API KEY MODAL */}
      <ApiKeyModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        onSave={(key) => setApiKey(key)}
      />
    </>
  );
}

export default App;
