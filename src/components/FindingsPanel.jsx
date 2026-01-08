import { useState } from "react";
import AiExplainPanel from "./AiExplainPanel";

const severityColor = {
  High: "#ff4d4f",
  Medium: "#faad14",
  Low: "#52c41a",
};

const FindingsPanel = ({ findings, fullScanFindings, onSelectLine }) => {
  const [activeTab, setActiveTab] = useState("realtime");
  const [selectedIssue, setSelectedIssue] = useState(null);

  const uniqueFullScanFindings = fullScanFindings.filter(
    (item, index, self) =>
      index === self.findIndex(
        (f) => f.ruleId === item.ruleId && f.line === item.line
      )
  );

  const renderCard = (item, children) => (
    <div
      onClick={() => onSelectLine?.(item.line)}
      style={{
        borderLeft: `4px solid ${severityColor[item.severity]}`,
        padding: "8px",
        marginBottom: "8px",
        background: "#1e1e1e",
        cursor: "pointer",
      }}
    >
      {children}
    </div>
  );

  return (
    <div style={{ padding: "10px", height: "100%" }}>
      <div style={{ display: "flex", marginBottom: "10px" }}>
        <div
          onClick={() => setActiveTab("realtime")}
          style={{
            padding: "6px 12px",
            cursor: "pointer",
            borderBottom:
              activeTab === "realtime"
                ? "2px solid #1890ff"
                : "2px solid transparent",
            color: activeTab === "realtime" ? "#1890ff" : "#aaa",
            fontWeight: 500,
          }}
        >
          Real-Time
        </div>

        <div
          onClick={() => setActiveTab("fullscan")}
          style={{
            padding: "6px 12px",
            cursor: "pointer",
            borderBottom:
              activeTab === "fullscan"
                ? "2px solid #1890ff"
                : "2px solid transparent",
            color: activeTab === "fullscan" ? "#1890ff" : "#aaa",
            fontWeight: 500,
          }}
        >
          Full Scan
        </div>
      </div>

      {activeTab === "realtime" &&
        (findings.length ? (
          findings.map((item, index) =>
            renderCard(item, (
              <>
                <strong style={{ color: severityColor[item.severity] }}>
                  {item.severity}
                </strong>{" "}
                — {item.name}
                <br />
                <small style={{ color: "#aaa" }}>
                  Line {item.line}: {item.code}
                </small>
              </>
            ))
          )
        ) : (
          <div style={{ padding: "10px", color: "#999" }}>
            ✅ No security issues detected
          </div>
        ))}

      {activeTab === "fullscan" &&
        (uniqueFullScanFindings.length ? (
          uniqueFullScanFindings.map((item, index) =>
            renderCard(item, (
              <>
                <strong style={{ color: severityColor[item.severity] }}>
                  {item.severity}
                </strong>{" "}
                — {item.name}
                <br />
                <small style={{ color: "#aaa" }}>
                  OWASP: {item.owasp}
                </small>
                <br />
                <small style={{ color: "#aaa" }}>
                  Line {item.line}: {item.code}
                </small>
                <br />
                <small style={{ color: "#9cdcfe" }}>
                  Fix: {item.recommendation}
                </small>
                <br />
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 🔑 prevent line click
                    setSelectedIssue(item);
                  }}
                  style={{
                    marginTop: "6px",
                    background: "#1890ff",
                    border: "none",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  🤖 AI Explain
                </button>
              </>
            ))
          )
        ) : (
          <div style={{ padding: "10px", color: "#777" }}>
            🔍 Run a full scan to see detailed security analysis results.
          </div>
        ))}

      <AiExplainPanel
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />
    </div>
  );
};

export default FindingsPanel;
