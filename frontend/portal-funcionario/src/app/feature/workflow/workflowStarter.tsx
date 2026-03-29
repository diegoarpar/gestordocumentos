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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        .wfd-root { min-height:100vh; background:#060b14; font-family:'DM Sans',sans-serif; color:#c8d6e8; padding:40px 48px; }

        .wfd-header { margin-bottom:36px; }
        .wfd-header-row { display:flex; align-items:center; gap:14px; margin-bottom:6px; }
        .wfd-header-icon { width:42px; height:42px; border-radius:12px; background:linear-gradient(135deg,#8b5cf622,#8b5cf644); border:1px solid #8b5cf644; display:flex; align-items:center; justify-content:center; font-size:20px; }
        .wfd-title { margin:0; font-size:28px; font-weight:800; font-family:'Sora',sans-serif; color:#e8edf5; letter-spacing:-0.5px; }
        .wfd-subtitle { margin:0; font-size:14px; color:#3d5060; margin-left:56px; }

        .wfd-stats { display:flex; gap:16px; margin-bottom:32px; }
        .wfd-stat { background:#0a111e; border:1px solid #1e2d45; border-radius:14px; padding:18px 24px; flex:1; position:relative; overflow:hidden; }
        .wfd-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; border-radius:2px 2px 0 0; background:var(--c); }
        .wfd-stat-val { font-size:30px; font-weight:800; font-family:'Sora',sans-serif; color:var(--c); }
        .wfd-stat-label { font-size:11px; color:#3d5060; font-weight:700; margin-top:2px; text-transform:uppercase; letter-spacing:.08em; }

        .wfd-controls { display:flex; align-items:center; gap:12px; margin-bottom:28px; flex-wrap:wrap; }
        .wfd-search-wrap { position:relative; flex:1; min-width:200px; max-width:360px; }
        .wfd-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#3d5060; pointer-events:none; }
        .wfd-search { width:100%; box-sizing:border-box; padding:0 14px 0 38px; height:42px; background:#0a111e; border:1px solid #1e2d45; border-radius:10px; color:#c8d6e8; font-size:14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; }
        .wfd-search:focus { border-color:#8b5cf6; }
        .wfd-count { margin-left:auto; font-size:13px; color:#3d5060; }

        .wfd-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:20px; }

        .wfd-card { background:#0a111e; border:1px solid #1e2d45; border-radius:18px; padding:26px; position:relative; overflow:hidden; display:flex; flex-direction:column; gap:18px; transition:transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s, border-color .2s; }
        .wfd-card.clickable { cursor:pointer; }
        .wfd-card.clickable:hover { transform:translateY(-4px); box-shadow:0 20px 52px rgba(0,0,0,.45); border-color:var(--c-border); }
        .wfd-card.inactive { opacity:.5; cursor:default; }
        .wfd-card-glow { position:absolute; top:-40px; right:-40px; width:120px; height:120px; border-radius:50%; background:radial-gradient(circle, var(--c-glow) 0%, transparent 70%); pointer-events:none; opacity:.35; transition:opacity .2s; }
        .wfd-card.clickable:hover .wfd-card-glow { opacity:.6; }
        .wfd-card-top { display:flex; align-items:flex-start; justify-content:space-between; }
        .wfd-card-icon { width:50px; height:50px; border-radius:14px; background:linear-gradient(135deg, var(--c-from), var(--c-to)); display:flex; align-items:center; justify-content:center; font-size:22px; box-shadow:0 6px 20px rgba(0,0,0,.35); flex-shrink:0; }
        .wfd-badge { display:inline-flex; align-items:center; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:600; }
        .wfd-badge-active { background:#10b98115; color:#10b981; border:1px solid #10b98130; }
        .wfd-badge-inactive { background:#e05c5c12; color:#e05c5c; border:1px solid #e05c5c30; }
        .wfd-card-name { font-size:16px; font-weight:700; color:#e8edf5; font-family:'Sora',sans-serif; letter-spacing:-.2px; margin:0 0 6px; }
        .wfd-card-desc { font-size:13px; color:#5a6a85; line-height:1.55; margin:0; flex:1; }
        .wfd-card-footer { display:flex; align-items:center; justify-content:flex-end; padding-top:6px; border-top:1px solid #111d2e; }
        .wfd-card-cta { font-size:13px; font-weight:700; color:var(--c-from); display:flex; align-items:center; gap:6px; opacity:0; transition:opacity .15s; }
        .wfd-card.clickable:hover .wfd-card-cta { opacity:1; }

        .wfd-empty { grid-column:1/-1; text-align:center; padding:80px 0; color:#2a3d58; }
        .wfd-empty-icon { font-size:52px; margin-bottom:14px; }
        .wfd-empty-text { font-size:15px; }

        .wfd-skeleton { background:#0a111e; border:1px solid #1e2d45; border-radius:18px; height:180px; animation:wfdPulse 1.4s ease-in-out infinite; }

        /* Side panel */
        .wfd-panel-overlay { position:fixed; inset:0; z-index:200; background:rgba(5,8,16,.86); backdrop-filter:blur(6px); display:flex; align-items:stretch; justify-content:flex-end; animation:wfdFadeIn .2s ease; }
        .wfd-panel { width:min(960px,95vw); height:100vh; background:#080d18; border-left:1px solid #1e2d45; display:flex; flex-direction:column; animation:wfdSlideIn .28s cubic-bezier(.16,1,.3,1); }
        .wfd-panel.fullscreen { width:100vw; border-left:none; }
        .wfd-panel-header { padding:18px 24px; border-bottom:1px solid #1e2d45; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; background:#0a111e; gap:16px; }
        .wfd-panel-info { display:flex; align-items:center; gap:14px; min-width:0; }
        .wfd-panel-icon { font-size:22px; flex-shrink:0; }
        .wfd-panel-name { font-size:15px; font-weight:700; color:#e8edf5; font-family:'Sora',sans-serif; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .wfd-panel-sub { font-size:12px; color:#3d5060; margin-top:2px; }
        .wfd-panel-close { background:none; border:1px solid #1e2d45; color:#5a6a85; cursor:pointer; font-size:20px; width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; transition:all .15s; flex-shrink:0; }
        .wfd-panel-close:hover { border-color:#8b5cf644; color:#e8edf5; }
        .wfd-panel-actions { display:flex; align-items:center; gap:8px; }
        .wfd-panel-btn { background:none; border:1px solid #1e2d45; color:#5a6a85; cursor:pointer; width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; transition:all .15s; flex-shrink:0; }
        .wfd-panel-btn:hover { border-color:#8b5cf644; color:#e8edf5; }
        .wfd-panel-body { flex:1; position:relative; overflow:hidden; }
        .wfd-iframe { width:100%; height:100%; border:none; display:block; transition:opacity .3s; }
        .wfd-panel-loading { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; color:#3d5060; font-size:14px; pointer-events:none; }
        .wfd-spinner { width:36px; height:36px; border:3px solid #1e2d45; border-top-color:#8b5cf6; border-radius:50%; animation:wfdSpin .7s linear infinite; }
        .wfd-no-url { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; color:#3d5060; }
        .wfd-no-url-icon { font-size:40px; }
        .wfd-no-url-text { font-size:14px; }

        @keyframes wfdPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes wfdFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes wfdSlideIn { from{transform:translateX(60px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes wfdSpin { to{transform:rotate(360deg)} }

        @media (max-width:768px) {
          .wfd-root { padding:24px 16px; }
          .wfd-stats { flex-direction:column; }
          .wfd-grid { grid-template-columns:1fr; }
          .wfd-panel { width:100vw; }
        }
      `}</style>

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
