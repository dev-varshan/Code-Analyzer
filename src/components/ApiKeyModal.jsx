import { useState } from "react";

const ApiKeyModal = ({ isOpen, onClose, onSave }) => {
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  /**
   * Validate API key format
   * Basic validation - checks if key is not empty and has reasonable length
   */
  const validateApiKey = (key) => {
    if (!key || key.trim().length === 0) {
      return "API key cannot be empty";
    }
    if (key.trim().length < 10) {
      return "API key seems too short";
    }
    return null;
  };

  /**
   * Handle save button click
   */
  const handleSave = () => {
    const trimmedKey = inputKey.trim();
    const validationError = validateApiKey(trimmedKey);

    if (validationError) {
      setError(validationError);
      return;
    }

    onSave(trimmedKey);
    setInputKey(""); // Clear input
    setError(""); // Clear error
    onClose();
  };

  /**
   * Handle Enter key press
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e) => {
    setInputKey(e.target.value);
    setError(""); // Clear error when user types
  };

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
      onClick={onClose} // Close on backdrop click
    >
      <div
        style={{
          width: "420px",
          background: "#1e1e1e",
          padding: "20px",
          borderRadius: "6px",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent close on modal click
      >
        <h3 style={{ marginBottom: "10px" }}>🔑 AI API Key</h3>

        <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "12px" }}>
          Provide your own LLM API key (Gemini).
          <br />
          The key is used only for this session and is never stored.
        </p>

        <input
          type="password"
          placeholder="Paste your API key here"
          value={inputKey}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "4px",
            background: "#141414",
            color: "#fff",
            border: error ? "1px solid #ff4d4f" : "1px solid #333",
            borderRadius: "4px",
            outline: "none",
          }}
        />

        {error && (
          <p style={{ fontSize: "12px", color: "#ff4d4f", marginBottom: "8px", marginTop: "4px" }}>
            {error}
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
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
            onClick={handleSave}
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

