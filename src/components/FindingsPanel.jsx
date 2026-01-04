import { useState } from "react";

const severityColor = {
  High: "#ff4d4f",
  Medium: "#faad14",
  Low: "#52c41a",
};

const FindingsPanel = ({ findings, fullScanFindings }) => {
  const [activeTab, setActiveTab] = useState("realtime");

  // 🔑 Deduplicate full scan results: same rule + same line only once
  const uniqueFullScanFindings = fullScanFindings.filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        (f) => f.ruleId === item.ruleId && f.line === item.line
      )
  );

  return (
    <div style={{ padding: "10px", height: "100%" }}>
      {/* Tabs */}
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

      {/* REAL-TIME TAB */}
      {activeTab === "realtime" && (
        <>
          {!findings.length ? (
            <div style={{ padding: "10px", color: "#999" }}>
              ✅ No security issues detected
            </div>
          ) : (
            <div>
              <h3 style={{ marginBottom: "10px" }}>
                ⚠️ Real-Time Security Warnings
              </h3>

              {findings.map((item, index) => (
                <div
                  key={index}
                  style={{
                    borderLeft: `4px solid ${severityColor[item.severity]}`,
                    padding: "8px",
                    marginBottom: "8px",
                    background: "#1e1e1e",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  <strong style={{ color: severityColor[item.severity] }}>
                    {item.severity}
                  </strong>{" "}
                  — {item.name}
                  <br />
                  <small style={{ color: "#aaa" }}>
                    Line {item.line}: {item.code}
                  </small>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* FULL SCAN TAB */}
      {activeTab === "fullscan" && (
        <>
          {!uniqueFullScanFindings.length ? (
            <div style={{ padding: "10px", color: "#777" }}>
              🔍 Run a full scan to see detailed security analysis results.
            </div>
          ) : (
            <div>
              <h3 style={{ marginBottom: "10px" }}>
                🧪 Full Scan Security Findings
              </h3>

              {uniqueFullScanFindings.map((item, index) => (
                <div
                  key={index}
                  style={{
                    borderLeft: `4px solid ${severityColor[item.severity]}`,
                    padding: "8px",
                    marginBottom: "8px",
                    background: "#1e1e1e",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
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
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FindingsPanel;
