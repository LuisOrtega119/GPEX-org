import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [org, setOrg] = useState(null);

  useEffect(() => {
   fetch(`/org.json?v=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then(setOrg)
      .catch((err) => console.error("Error loading org.json:", err));
  }, []);

  if (!org) {
    return <div className="loading">Loading organization data...</div>;
  }

  return (
    <div className="app-container">
      <h1>{org.title}</h1>

      <div className="manager-card">
        <div className="avatar">👤</div>
        <div>
          <h2>{org.manager.title}</h2>
          <p>{org.manager.name}</p>
        </div>
      </div>

      <div className="positions-grid">
        {org.positions.map((p) => (
          <div className="position-card" key={p.title}>
            <div className="avatar">👤</div>
            <h3>{p.title}</h3>
            <p className="optional">
              {p.name ? p.name : "Nombre (opcional)"}
            </p>
          </div>
        ))}
      </div>

      <hr />
      <h3>Funciones por Puesto</h3>
      <div className="functions-box">
        {org.positions.map((p, i) => (
          <div key={i} className="function-item">
            <b>
              {i + 1}. {p.title}
            </b>
            <p>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
