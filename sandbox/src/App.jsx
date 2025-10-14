import React, { useEffect, useState } from "react";

export default function App() {
  const [orgData, setOrgData] = useState(null);

  useEffect(() => {
    fetch("/org.json")
      .then((res) => res.json())
      .then(setOrgData)
      .catch(console.error);
  }, []);

  if (!orgData) return <h2 style={{ padding: 20 }}>Loading...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{orgData.title}</h1>
      <h2>{orgData.manager.title}: {orgData.manager.name}</h2>
      <div style={{ display: "flex", gap: 20 }}>
        {orgData.positions.map((p) => (
          <div
            key={p.title}
            style={{
              border: "2px solid #2d354b",
              borderRadius: 10,
              padding: 10,
              width: 200
            }}
          >
            <h3>{p.title}</h3>
            <p style={{ fontWeight: "bold" }}>{p.name || "(vacant)"}</p>
            <p style={{ fontSize: 12 }}>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
