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

        <div className="wfd-root">
          <div className="wfd-header">
            <div className="wfd-header-row">
              <div className="wfd-header-icon">🚀</div>
              <h1 className="wfd-title">Procesos Disponibles</h1>
            </div>
            <p className="wfd-subtitle">Selecciona un proceso para iniciar una nueva instancia</p>
          </div>

          <div className="wfd-stats">
            {[
              { label: "Total", value: workflows.length, color: "#8b5cf6" },
              { label: "Disponibles", value: activeCount, color: "#10b981" },
              { label: "Inactivos", value: workflows.length - activeCount, color: "#e05c5c" },
            ].map((s) => (
              <div key={s.label} className="wfd-stat" style={{ "--c": s.color } as React.CSSProperties}>
                <div className="wfd-stat-val">{s.value}</div>
                <div className="wfd-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="wfd-controls">
            <div className="wfd-search-wrap">
              <span className="wfd-search-icon">🔍</span>
              <input
                className="wfd-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar proceso…"
              />
            </div>
            <span className="wfd-count">{filtered.length} proceso{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="wfd-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="wfd-skeleton" />)
              : filtered.length === 0
              ? (
                <div className="wfd-empty">
                  <div className="wfd-empty-icon">📭</div>
                  <div className="wfd-empty-text">No se encontraron procesos</div>
                </div>
              )
              : filtered.map((workflow, i) => {
                  const { from, to } = CARD_COLORS[i % CARD_COLORS.length];
                  return (
                    <div
                      key={workflow.id}
                      className={`wfd-card ${workflow.active ? "clickable" : "inactive"}`}
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
                      <div className="wfd-card-glow" />
                      <div className="wfd-card-top">
                        <div className="wfd-card-icon">🔄</div>
                        <span className={`wfd-badge ${workflow.active ? "wfd-badge-active" : "wfd-badge-inactive"}`}>
                          {workflow.active ? "● Activo" : "○ Inactivo"}
                        </span>
                      </div>
                      <div>
                        <p className="wfd-card-name">{workflow.name}</p>
                        <p className="wfd-card-desc">{workflow.description ?? "Sin descripción"}</p>
                      </div>
                      <div className="wfd-card-footer">
                        <span className="wfd-card-cta">
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
        <div className="wfd-panel-overlay" onClick={(e) => e.target === e.currentTarget && closePanel()}>
          <div className={`wfd-panel${fullscreen ? " fullscreen" : ""}`}>
            <div className="wfd-panel-header">
              <div className="wfd-panel-info">
                <span className="wfd-panel-icon">🔄</span>
                <div>
                  <div className="wfd-panel-name">{selected.name}</div>
                  <div className="wfd-panel-sub">Nueva instancia del proceso</div>
                </div>
              </div>
              <div className="wfd-panel-actions">
                <button className="wfd-panel-btn" onClick={() => setFullscreen((f) => !f)} aria-label={fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
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
                <button className="wfd-panel-close" onClick={closePanel} aria-label="Cerrar">×</button>
              </div>
            </div>
            <div className="wfd-panel-body">
              {!selected.href ? (
                <div className="wfd-no-url">
                  <div className="wfd-no-url-icon">🔗</div>
                  <div className="wfd-no-url-text">Este proceso no tiene URL configurada</div>
                </div>
              ) : (
                <>
                  {iframeLoading && (
                    <div className="wfd-panel-loading">
                      <div className="wfd-spinner" />
                      <span>Cargando formulario…</span>
                    </div>
                  )}
                  <iframe
                    src={`${selected.href}${selected.href!.includes("?") ? "&" : "?"}workflowId=${encodeURIComponent(selected.id)}&taskId=${encodeURIComponent(selected.id)}`}
                    className="wfd-iframe"
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
