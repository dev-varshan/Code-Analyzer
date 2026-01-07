import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { explainIssueWithAI } from "../ai/explainWithAI";

const DEFAULT_WIDTH = 440;
const MIN_WIDTH = DEFAULT_WIDTH;

const AiExplainPanel = ({ issue, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [width, setWidth] = useState(DEFAULT_WIDTH);

  const isResizingRef = useRef(false);

  // 🔑 Reset width BEFORE paint (prevents flicker)
  useLayoutEffect(() => {
    if (issue) {
      setWidth(DEFAULT_WIDTH);
      setResponse("");
      setError("");
      setLoading(false);
    }
  }, [issue]);

  // ---- RESIZE HANDLERS ----
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
  };

  const onMouseMove = (e) => {
    if (!isResizingRef.current) return;

    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= MIN_WIDTH) {
      setWidth(newWidth);
    }
  };

  const onMouseUp = () => {
    isResizingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const runAI = async (type) => {
    if (!window.__AI_API_KEY__) {
      setError("AI API key not provided.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const text = await explainIssueWithAI({
        provider: "gemini",
        apiKey: window.__AI_API_KEY__,
        issue,
        fullCode: window.__FULL_CODE__ || "",
        type,
      });
      setResponse(text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Safe conditional render (hooks already executed)
  if (!issue) return null;

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        width: `${width}px`,
        background: "#111",
        borderLeft: "1px solid #333",
        zIndex: 999,
        padding: "16px",
        overflowY: "auto",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* RESIZE HANDLE */}
      <div
        onMouseDown={onMouseDown}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "6px",
          height: "100%",
          cursor: "col-resize",
          zIndex: 1000,
        }}
      />

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0 }}>🤖 AI Security Explanation</h3>
        <button onClick={onClose} style={closeBtn}>✕</button>
      </div>

      {/* ISSUE META */}
      <div
        style={{
          fontSize: "13px",
          color: "#aaa",
          marginBottom: "12px",
          marginTop: "6px",
        }}
      >
        {issue.name} • Line {issue.line}
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button onClick={() => runAI("WHY_INSECURE")} style={btnStyle}>
          Why is this insecure?
        </button>
        <button onClick={() => runAI("ATTACK_SCENARIO")} style={btnStyle}>
          How can an attacker exploit this?
        </button>
        <button onClick={() => runAI("OWASP_EXPLANATION")} style={btnStyle}>
          Why this OWASP category?
        </button>
        <button onClick={() => runAI("PRODUCTION_IMPACT")} style={btnStyle}>
          What if this goes to production?
        </button>
        <button onClick={() => runAI("SECURE_FIX")} style={btnStyle}>
          Show secure alternative
        </button>
      </div>

      {/* AI RESPONSE */}
      <div
        style={{
          marginTop: "14px",
          fontSize: "13px",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        {loading && <span style={{ color: "#1890ff" }}>Thinking...</span>}
        {error && <span style={{ color: "#ff4d4f" }}>{error}</span>}
        {response && (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              color: "#ddd",
              marginTop: "8px",
            }}
          >
            {response}
          </pre>
        )}
      </div>
    </div>
  );
};

const btnStyle = {
  padding: "8px",
  background: "#1e1e1e",
  border: "1px solid #333",
  color: "#fff",
  borderRadius: "4px",
  cursor: "pointer",
  textAlign: "left",
};

const closeBtn = {
  background: "transparent",
  border: "none",
  color: "#aaa",
  cursor: "pointer",
  fontSize: "16px",
};

export default AiExplainPanel;
