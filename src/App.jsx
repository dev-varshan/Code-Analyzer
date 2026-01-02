import { useState, useEffect, useMemo } from "react";
import CodeEditor from "./components/CodeEditor";
import { runRealtimeAnalysis } from "./analysis/runRealtimeAnalysis";
import { debounce } from "./utils/debounce";
import "./App.css";

function App() {
  const [code, setCode] = useState(`# Write Python code here
user_input = input()
eval(user_input)
`);
  const [realtimeFindings, setRealtimeFindings] = useState([]);

  const debouncedAnalysis = useMemo(
    () =>
      debounce((code) => {
        const results = runRealtimeAnalysis(code);
        setRealtimeFindings(results);
        console.log("Real-time findings:", results);
      }, 500),
    []
  );

  useEffect(() => {
    debouncedAnalysis(code);
  }, [code, debouncedAnalysis]);

  return (
    <>
      <header className="app-header">
        <h2 className="app-title">Secure Python Code Analyzer</h2>
        {/* Run / Analyze button can be added later */}
      </header>

      <main className="editor-container">
        <CodeEditor code={code} setCode={setCode} />
      </main>
    </>
  );
}

export default App;
