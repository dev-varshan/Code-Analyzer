const ApiKeyModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  let inputKey = "";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#1e1e1e",
          padding: "20px",
          borderRadius: "6px",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>🔑 AI API Key</h3>

        <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "12px" }}>
          Provide your own LLM API key (Gemini / OpenAI).
          <br />
          The key is used only for this session and is never stored.
        </p>

        <input
          type="password"
          placeholder="Paste your API key here"
          onChange={(e) => (inputKey = e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "12px",
            background: "#141414",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: "4px",
          }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              color: "#aaa",
              border: "1px solid #444",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (inputKey.trim()) {
                onSave(inputKey.trim());
                onClose();
              }
            }}
            style={{
              background: "#1890ff",
              color: "#fff",
              border: "none",
              padding: "6px 14px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
