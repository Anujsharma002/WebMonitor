import { useState } from "react";

export default function AddLinkForm({ onAdd }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  function submit() {
    if (!url.startsWith("http")) {
      setError("Please enter a valid URL");
      return;
    }
    setError("");
    onAdd(url);
    setUrl("");
  }

  return (
    <>
      <h3>Add Webpage</h3>
      <input
        placeholder="https://example.com"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />
      <button onClick={submit}>Add Link</button>
      {error && <p className="error">{error}</p>}
    </>
  );
}