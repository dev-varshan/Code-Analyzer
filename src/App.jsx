import { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import "./App.css";

function App() {
  const [code, setCode] = useState(`# Write Python code here
user_input = input()
eval(user_input)
`);

  return (
    // The #root in CSS handles the main layout now
    <>
      <header className="app-header">
        <h2 className="app-title">Secure Python Code Analyzer</h2>
        {/* You can add a 'Run' or 'Analyze' button here later */}
      </header>
      
      <main className="editor-container">
        <CodeEditor code={code} setCode={setCode} />
      </main>
    </>
  );
}

export default App;