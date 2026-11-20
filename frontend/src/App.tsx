import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "/api/analyze";
const MIN_CHARS = 50;
const MAX_CHARS = 6000;

export default function App() {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const length = jobDescription.trim().length;
  const tooShort = length < MIN_CHARS;
  const tooLong = length > MAX_CHARS;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (tooShort || tooLong || loading) return;

    setLoading(true);
    setError("");
    setAnalysis("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });
      const data = (await response.json()) as {
        analysis?: string;
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setAnalysis(data.analysis ?? "");
    } catch {
      setError("Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>AI Job Match Assistant</h1>
      <p className="subtitle">
        Paste a job description to get a role summary, key skills, and
        interview prep questions.
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="jd">Job description</label>
        <textarea
          id="jd"
          rows={12}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
        />
        <div className={tooLong ? "counter over" : "counter"}>
          {length} / {MAX_CHARS}
        </div>
        <button type="submit" disabled={tooShort || tooLong || loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}
      {analysis && (
        <section className="result" aria-live="polite">
          <h2>Analysis</h2>
          <pre>{analysis}</pre>
        </section>
      )}
    </main>
  );
}
