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
      <h3>⚠️ Real-Time Security Warnings</h3>

      {findings.map((item, index) => (
        <div
          key={index}
          style={{
            borderLeft: `4px solid ${severityColor[item.severity]}`,
            padding: "8px",
            marginBottom: "8px",
            background: "#1e1e1e",
          }}
        >
          <strong style={{ color: severityColor[item.severity] }}>
            {item.severity}
          </strong>{" "}
          — {item.name} <br />
          <small>Line {item.line}: {item.code}</small>
        </div>
      ))}
    </div>
  );
};

export default FindingsPanel;
