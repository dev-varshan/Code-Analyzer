import { useState, useEffect, useMemo } from "react";
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

  // Debounced realtime analysis
  const debouncedAnalysis = useMemo(
    () =>
      debounce((code) => {
        const results = runRealtimeAnalysis(code);
        setRealtimeFindings(results);
        console.log("🔎 Realtime Analysis Findings:", results);

      }, 500),
    []
  );

  // Run analysis whenever code changes
  useEffect(() => {
    debouncedAnalysis(code);
  }, [code, debouncedAnalysis]);

  return (
    <>
      {/* Header stays exactly as your existing structure */}
      <header className="app-header">
        <h2 className="app-title">Secure Python Code Analyzer</h2>
        {/* Run / Analyze button can be added later */}
      </header>

      {/* Main Layout */}
      <main
        className="editor-container"
        style={{ display: "flex", height: "calc(100vh - 60px)" }}
      >
        {/* Code Editor */}
        <div style={{ flex: 3 }}>
          <CodeEditor code={code} setCode={setCode} />
        </div>

        {/* Findings Panel */}
        <div
          style={{
            flex: 1,
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
