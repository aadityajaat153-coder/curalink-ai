import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API = "https://curalink-backend-6atx.onrender.com";

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setData(null);
    setSummary("");

    try {
      // 🔥 Run BOTH APIs in parallel (faster 🚀)
      const [researchRes, summaryRes] = await Promise.all([
        fetch(`${API}/api/research?query=${query}`),
        fetch(`${API}/api/summary`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        }),
      ]);

      const researchData = await researchRes.json();
      const summaryData = await summaryRes.json();

      // ✅ Safe handling
      setData(researchData || {});
      setSummary(summaryData?.summary || "No summary available");

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      
      {/* TITLE */}
      <h1>🧠 CuraLink AI</h1>

      {/* SEARCH */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search disease..."
          style={{ padding: "10px", width: "300px" }}
        />
        <button onClick={handleSearch} style={{ padding: "10px 20px" }}>
          Search
        </button>
      </div>

      {/* LOADING */}
      {loading && <p>⏳ Loading...</p>}

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* RESULTS */}
      {(data || summary) && !loading && (
        <div className="grid" style={{ display: "grid", gap: "20px" }}>

          {/* 🤖 AI SUMMARY */}
          {summary && (
            <div className="card" style={{ padding: "20px", borderRadius: "10px", background: "#1e293b", color: "white" }}>
              <h2>🤖 AI Summary</h2>
              <pre style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
                {summary}
              </pre>
            </div>
          )}

          {/* 📄 PAPERS */}
          {data?.papers?.length > 0 && (
            <div className="card" style={{ padding: "20px", borderRadius: "10px", background: "#1e293b", color: "white" }}>
              <h2>📄 Research Papers</h2>
              {data.papers.map((p, i) => (
                <div key={i} style={{ marginBottom: "15px", textAlign: "left" }}>
                  <h4>{p.title}</h4>
                  <p>{p.authors}</p>
                  <small>{p.year}</small>
                </div>
              ))}
            </div>
          )}

          {/* 🧪 TRIALS */}
          {data?.trials?.length > 0 && (
            <div className="card" style={{ padding: "20px", borderRadius: "10px", background: "#1e293b", color: "white" }}>
              <h2>🧪 Clinical Trials</h2>
              {data.trials.map((t, i) => (
                <div key={i} style={{ marginBottom: "15px", textAlign: "left" }}>
                  <h4>{t.title}</h4>
                  <p>Phase: {t.phase}</p>
                  <p>Location: {t.location}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default App;