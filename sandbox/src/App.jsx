import React, { useEffect, useMemo, useState } from "react";
import "./index.css";

/* ===== Plantillas base ===== */
const BASE5 = [
  { id: 1, role: "Director General México", name: "", reportsTo: null },
  { id: 2, role: "Sales Manager", name: "", reportsTo: 1 },
  { id: 3, role: "Pricing Coordinator", name: "", reportsTo: 1 },
  { id: 4, role: "Operations Manager", name: "", reportsTo: 1 },
  { id: 5, role: "HR & Admin Coordinator", name: "", reportsTo: 1 },
];

const EXTRA5 = [
  { id: 6, role: "Inside Sales", name: "", reportsTo: 2 },
  { id: 7, role: "Customer Success (CSR)", name: "", reportsTo: 2 },
  { id: 8, role: "Dispatcher", name: "", reportsTo: 4 },
  { id: 9, role: "Customs/Border Specialist", name: "", reportsTo: 4 },
  { id: 10, role: "Docs & Billing Support", name: "", reportsTo: 4 },
];

const BASE10 = [...BASE5, ...EXTRA5];

const STORAGE_KEY = "gpex-org-mx-v1";

/* ===== UI ===== */
function UserBadge() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <circle cx="12" cy="9" r="4" fill="#fff" />
      <path d="M4 20c1.8-4 7.2-4 8-4s6.2 0 8 4" fill="#fff" />
    </svg>
  );
}

function NodeBox({ node, onChange }) {
  return (
    <div className="node-wrap">
      <div className="node">
        <div className="node-left">
          <UserBadge />
        </div>
        <div className="node-right">
          <input
            className="node-input role"
            placeholder="Puesto"
            value={node.role}
            onChange={(e) => onChange(node.id, "role", e.target.value)}
          />
          <input
            className="node-input name"
            placeholder="Nombre (opcional)"
            value={node.name}
            onChange={(e) => onChange(node.id, "name", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function Tree({ root, childrenBy, onChange }) {
  const children = childrenBy[root.id] || [];
  return (
    <div className="branch">
      <NodeBox node={root} onChange={onChange} />
      {children.length > 0 && (
        <div className="children">
          {children.map((child) => (
            <div className="child" key={child.id}>
              <Tree root={child} childrenBy={childrenBy} onChange={onChange} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  // 1) Carga inicial desde localStorage o base 5
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : BASE5;
    } catch {
      return BASE5;
    }
  });

  // 2) Autosave
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  // 3) Índices para dibujar
  const childrenBy = useMemo(() => {
    const m = {};
    data.forEach((n) => {
      if (n.reportsTo !== null) (m[n.reportsTo] ||= []).push(n);
    });
    Object.values(m).forEach((arr) => arr.sort((a, b) => a.id - b.id));
    return m;
  }, [data]);
  const roots = useMemo(() => data.filter((n) => n.reportsTo === null), [data]);

  // 4) Editar campos
  const handleChange = (id, field, value) => {
    setData((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [field]: value } : n))
    );
  };

  // 5) Fusionar sin perder ediciones
  const mergeWithCurrent = (targetTemplate) => {
    const currentById = Object.fromEntries(data.map((n) => [n.id, n]));
    return targetTemplate.map((n) => ({ ...n, ...currentById[n.id] }));
  };

  // 6) Acciones de barra
  const show5 = () => setData(mergeWithCurrent(BASE5));
  const show10 = () => setData(mergeWithCurrent(BASE10));
  const reset = () => setData(BASE5); // restablece por completo (sin tus ediciones)

  return (
    <div className="wrap">
      <div className="topbar">
        <h1>Organigrama GPEX México</h1>
        <div className="actions">
          <button onClick={show5}>Ver 5 puestos</button>
          <button onClick={show10}>Ver 10 puestos</button>
          <button onClick={reset} title="Restablecer plantilla">
            Restablecer
          </button>
        </div>
      </div>

      <div className="chart">
        {roots.map((r) => (
          <Tree
            key={r.id}
            root={r}
            childrenBy={childrenBy}
            onChange={handleChange}
          />
        ))}
      </div>

      <div className="funciones-lista">
        <h2>Funciones por Puesto</h2>
        <textarea
          className="funciones-textarea"
          placeholder="Escribe aquí las funciones detalladas de cada puesto..."
          onChange={(e) => {
            // opcional: también puedes persistir esto si quieres
            try {
              localStorage.setItem(`${STORAGE_KEY}-functions`, e.target.value);
            } catch {}
          }}
          defaultValue={(() => {
            try {
              return localStorage.getItem(`${STORAGE_KEY}-functions`) || "";
            } catch {
              return "";
            }
          })()}
        />
      </div>
    </div>
  );
}
