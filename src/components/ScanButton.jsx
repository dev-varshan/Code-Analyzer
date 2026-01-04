const ScanButton = ({ onScan }) => {
  return (
    <button
      onClick={onScan}
      style={{
        padding: "8px 16px",
        margin: "10px",
        background: "#1890ff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: 500,
      }}
    >
      🔍 Run Full Scan
    </button>
  );
};

export default ScanButton;
