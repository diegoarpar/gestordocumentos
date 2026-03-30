"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/MoreVert";
import NavMenu from "@/app/feature/menus/menu";
import AdminServices from "@/app/api/adminServices";
import "./workflowStarter.css";

type Workflow = {
  id: string;
  name: string;
  description?: string;
  href?: string;
  active: boolean;
};

const SEED_WORKFLOWS: Workflow[] = [
];

const CARD_COLORS = [
  { from: "#3b82f6", to: "#1d4ed8" },
  { from: "#8b5cf6", to: "#6d28d9" },
  { from: "#10b981", to: "#047857" },
  { from: "#f59e0b", to: "#b45309" },
  { from: "#ef4444", to: "#b91c1c" },
  { from: "#06b6d4", to: "#0e7490" },
  { from: "#ec4899", to: "#be185d" },
  { from: "#14b8a6", to: "#0f766e" },
];

export default function WorkflowStarter() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Workflow | null>(null);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    AdminServices.GetWorkflows()
      .then((res) => res.json())
      .then((data) => {
        setWorkflows(
          Array.isArray(data)
            ? data
            : Array.isArray(data.workflows)
            ? data.workflows
            : SEED_WORKFLOWS
        );
      })
      .catch(() => setWorkflows(SEED_WORKFLOWS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = workflows.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      (w.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = workflows.filter((w) => w.active).length;

  const openWorkflow = (workflow: Workflow) => {
    console.log("loading ..." + workflow.href);
    if (!workflow.active) return;
    setIframeLoading(true);
    setSelected(workflow);
  };

  const closePanel = () => { setSelected(null); setFullscreen(false); };

  return (
    <>
      <div>
        <AppBar position="static" sx={{ bgcolor: "#0a111e", borderBottom: "1px solid #1e2d45", boxShadow: "none" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ zIndex: 10 }} onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>
              Iniciar Proceso
            </Typography>
            <Button color="inherit" variant="outlined" size="small" onClick={() => router.push("/pages/portal")}>
              Portal
            </Button>
          </Toolbar>
        </AppBar>

        {sidebarOpen && (
          <NavMenu
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            contTramites={0}
            handleContTramites={() => {}}
          />
        )}

        <div className="root">
          <div className="header">
            <div className="header-row">
              <div className="header-icon">🚀</div>
              <h1 className="title">Procesos Disponibles</h1>
            </div>
            <p className="subtitle">Selecciona un proceso para iniciar una nueva instancia</p>
          </div>

          <div className="stats">
            {[
              { label: "Total", value: workflows.length, color: "#8b5cf6" },
              { label: "Disponibles", value: activeCount, color: "#10b981" },
              { label: "Inactivos", value: workflows.length - activeCount, color: "#e05c5c" },
            ].map((s) => (
              <div key={s.label} className="stat" style={{ "--c": s.color } as React.CSSProperties}>
                <div className="stat-val">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="controls">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar proceso…"
              />
            </div>
            <span className="count">{filtered.length} proceso{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" />)
              : filtered.length === 0
              ? (
                <div className="empty">
                  <div className="empty-icon">📭</div>
                  <div className="empty-text">No se encontraron procesos</div>
                </div>
              )
              : filtered.map((workflow, i) => {
                  const { from, to } = CARD_COLORS[i % CARD_COLORS.length];
                  return (
                    <div
                      key={workflow.id}
                      className={`card ${workflow.active ? "clickable" : "inactive"}`}
                      style={{
                        "--c-from": from,
                        "--c-to": to,
                        "--c-glow": from,
                        "--c-border": `${from}55`,
                      } as React.CSSProperties}
                      onClick={() => openWorkflow(workflow)}
                      role={workflow.active ? "button" : undefined}
                      tabIndex={workflow.active ? 0 : undefined}
                      onKeyDown={(e) => e.key === "Enter" && openWorkflow(workflow)}
                    >
                      <div className="card-glow" />
                      <div className="card-top">
                        <div className="card-icon">🔄</div>
                        <span className={`badge ${workflow.active ? "badge-active" : "badge-inactive"}`}>
                          {workflow.active ? "● Activo" : "○ Inactivo"}
                        </span>
                      </div>
                      <div>
                        <p className="card-name">{workflow.name}</p>
                        <p className="card-desc">{workflow.description ?? "Sin descripción"}</p>
                      </div>
                      <div className="card-footer">
                        <span className="card-cta">
                          Iniciar proceso
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </div>
      </div>

      {selected && (
        <div className="panel-overlay" onClick={(e) => e.target === e.currentTarget && closePanel()}>
          <div className={`panel${fullscreen ? " fullscreen" : ""}`}>
            <div className="panel-header">
              <div className="panel-info">
                <span className="panel-icon">🔄</span>
                <div>
                  <div className="panel-name">{selected.name}</div>
                  <div className="panel-sub">Nueva instancia del proceso</div>
                </div>
              </div>
              <div className="panel-actions">
                <button className="panel-btn" onClick={() => setFullscreen((f) => !f)} aria-label={fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
                  {fullscreen ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                  )}
                </button>
                <button className="panel-close" onClick={closePanel} aria-label="Cerrar">×</button>
              </div>
            </div>
            <div className="panel-body">
              {!selected.href ? (
                <div className="no-url">
                  <div className="no-url-icon">🔗</div>
                  <div className="no-url-text">Este proceso no tiene URL configurada</div>
                </div>
              ) : (
                <>
                  {iframeLoading && (
                    <div className="panel-loading">
                      <div className="spinner" />
                      <span>Cargando formulario…</span>
                    </div>
                  )}
                  <iframe
                    src={`${selected.href}${selected.href!.includes("?") ? "&" : "?"}workflowId=${encodeURIComponent(selected.id)}&taskId=${encodeURIComponent(selected.id)}`}
                    className="iframe"
                    style={{ opacity: iframeLoading ? 0 : 1 }}
                    onLoad={() => setIframeLoading(false)}
                    title={selected.name}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
