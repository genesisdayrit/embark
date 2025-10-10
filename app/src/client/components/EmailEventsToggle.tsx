import { useState } from "react";

export default function EmailEventsToggle() {
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState("");

  async function enable() {
    setBusy(true);
    try {
      const res = await fetch("/api/enable-pubsub", { method: "POST" });
      const json = await res.json();
      setEnabled(true);
      setLog((l) => l + "\n" + (json.message || "Enabled."));
    } catch (e: any) {
      setLog((l) => l + "\nEnable failed: " + e.message);
    } finally {
      setBusy(false);
    }
  }

  async function sendTestEmail() {
    setBusy(true);
    try {
      const res = await fetch("/api/publish-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: {
            id: cryptoRandomId(),
            from: "events@yourapp.com",
            to: "user@example.com",
            subject: "Test Email Event",
            text: "This is a test payload"
          }
        })
      });
      const json = await res.json();
      setLog((l) => l + `\nPublished messageId: ${json.messageId}`);
    } catch (e: any) {
      setLog((l) => l + "\nPublish failed: " + e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
      <h3 style={{ marginTop: 0 }}>Email Events via Pub/Sub</h3>
      <button disabled={busy || enabled} onClick={enable}>
        {enabled ? "Enabled" : busy ? "Enabling..." : "Enable Pub/Sub"}
      </button>
      <button style={{ marginLeft: 8 }} disabled={!enabled || busy} onClick={sendTestEmail}>
        {busy ? "Sending..." : "Send Test Email Event"}
      </button>
      <pre style={{ whiteSpace: "pre-wrap", marginTop: 12, fontSize: 12 }}>{log}</pre>
    </div>
  );
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2);
}

