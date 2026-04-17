import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "https://curalink-backend-6atx.onrender.com";

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);

    try {
      // 🔥 CALL RESEARCH API
      const res1 = await fetch(
        `${API}/api/research?query=${query}`
      );
      const researchData = await res1.json();

      // 🔥 CALL SUMMARY API
      const res2 = await fetch(`${API}/api/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const summaryData = await res2.json();

      setData(researchData);
      setSummary(summaryData.summary);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div>
      {/* TITLE */}
      <h1>🧠 CuraLink AI</h1>

      {/* SEARCH */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search disease..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* RESULTS */}
      {(data || summary) && (
        <div className="grid">

          {/* ✅ AI SUMMARY (STRING SAFE) */}
          <div className="card">
            <h2>🤖 AI Summary</h2>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {summary}
            </pre>
          </div>

          {/* ✅ PAPERS */}
          {data?.papers && (
            <div className="card">
              <h2>📄 Research Papers</h2>
              {data.papers.map((p, i) => (
                <div key={i} className="item">
                  <h4>{p.title}</h4>
                  <p>{p.authors}</p>
                  <small>{p.year}</small>
                </div>
              ))}
            </div>
          )}

          {/* ✅ TRIALS */}
          {data?.trials && (
            <div className="card">
              <h2>🧪 Clinical Trials</h2>
              {data.trials.map((t, i) => (
                <div key={i} className="item">
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