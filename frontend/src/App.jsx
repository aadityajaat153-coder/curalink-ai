import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/research?query=${query}`
      );
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div>
      {/* TITLE */}
      <h1>🧠 CuraLink AI</h1>

      {/* SEARCH BAR */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search disease..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* LOADER */}
      {loading && <div className="loader"></div>}

      {/* RESULTS */}
      {data && (
        <div className="grid">
          
          {/* AI SUMMARY */}
          <div className="card">
            <h2>🤖 AI Summary</h2>
            <p><b>Overview:</b> {data.summary.overview}</p>

            <h3>Key Findings</h3>
            <ul>
              {data.summary.key_findings.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>

            <h3>Treatment Insights</h3>
            <ul>
              {data.summary.treatment_insights.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>

            <h3>Risks</h3>
            <ul>
              {data.summary.risks.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* PAPERS */}
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

          {/* CLINICAL TRIALS */}
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

        </div>
      )}
    </div>
  );
}

export default App;