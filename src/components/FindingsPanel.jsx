const severityColor = {
  High: "#ff4d4f",
  Medium: "#faad14",
  Low: "#52c41a",
};

const FindingsPanel = ({ findings }) => {
  if (!findings.length) {
    return (
      <div style={{ padding: "10px", color: "#999" }}>
        ✅ No security issues detected
      </div>
    );
  }

  return (
    <div style={{ padding: "10px" }}>
      <h3 style={{ marginBottom: "10px" }}>⚠️ Real-Time Security Warnings</h3>

      {findings.map((item, index) => (
        <div
          key={index}
          style={{
            borderLeft: `4px solid ${severityColor[item.severity]}`,
            padding: "8px",
            marginBottom: "8px",
            background: "#1e1e1e",
            wordBreak: "break-word",     // 🔑 responsive text
            overflowWrap: "anywhere",   // 🔑 responsive text
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
  );
};

export default FindingsPanel;
