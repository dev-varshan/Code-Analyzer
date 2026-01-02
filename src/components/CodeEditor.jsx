import Editor from "@monaco-editor/react";



const CodeEditor = ({ code, setCode }) => {

  return (

    <Editor

      height="100%" 

      language="python"

      theme="vs-dark"

      value={code}

      onChange={(value) => setCode(value)}

      options={{

        fontSize: 14,

        minimap: { enabled: false },

        automaticLayout: true,

        scrollBeyondLastLine: false,

        padding: { top: 16, bottom: 16 }, // Adds subtle breathing room inside the editor

      }}

    />

  );

};



export default CodeEditor;