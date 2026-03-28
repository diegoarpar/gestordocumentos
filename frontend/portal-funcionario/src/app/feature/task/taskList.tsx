"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/MoreVert";
import NavMenu from "@/app/feature/menus/menu";
import AdminServices from "@/app/api/adminServices";

type Task = {
  TASK_ID: string;
  TASK_NAME: string;
  TASK_PRIORITY: string;
  TASK_DUE_DATE: string | null;
  USER_NAME: string;
  INSTANCE_ID: string;
};

function priorityBadge(priority: string) {
  const n = parseInt(priority ?? "0", 10);
  if (n >= 70) return { bg: "#ef444415", text: "#ef4444", border: "#ef444430", label: "Alta" };
  if (n >= 40) return { bg: "#f59e0b15", text: "#f59e0b", border: "#f59e0b30", label: "Media" };
  return { bg: "#10b98115", text: "#10b981", border: "#10b98130", label: "Baja" };
}

const PAGE_SIZE = 10;

export default function TaskList({ user }: { user: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // panels
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [iframeTask, setIframeTask] = useState<Task | null>(null);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [reassignTask, setReassignTask] = useState<Task | null>(null);
  const [reassignUser, setReassignUser] = useState("");

  const router = useRouter();

  const fetchTasks = useCallback((username: string) => {
    setLoading(true);
    setError(null);
    AdminServices.GetUserTasks(username || "")
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => setTasks(Array.isArray(data?.taskInformation) ? data.taskInformation : []))
      .catch((err) => setError(err.message ?? "No se pudieron cargar las tareas"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchTasks(user); }, [user, fetchTasks]);

  const filtered = tasks.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.TASK_NAME?.toLowerCase().includes(q) ||
      t.TASK_ID?.toLowerCase().includes(q) ||
      t.INSTANCE_ID?.toLowerCase().includes(q) ||
      t.USER_NAME?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const highCount = tasks.filter((t) => parseInt(t.TASK_PRIORITY ?? "0", 10) >= 70).length;
  const withDueDate = tasks.filter((t) => !!t.TASK_DUE_DATE).length;

  const openIframe = (task: Task) => {
    setIframeLoading(true);
    setFullscreen(false);
    setIframeTask(task);
  };

  const closeIframe = () => { setIframeTask(null); setFullscreen(false); };

  const openReassign = (task: Task) => { setReassignTask(task); setReassignUser(""); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        .tl-root { min-height:100vh; background:#060b14; font-family:'DM Sans',sans-serif; color:#c8d6e8; padding:40px 48px; }

        .tl-header { margin-bottom:32px; }
        .tl-header-row { display:flex; align-items:center; gap:14px; margin-bottom:6px; }
        .tl-header-icon { width:42px; height:42px; border-radius:12px; background:linear-gradient(135deg,#3b82f622,#3b82f644); border:1px solid #3b82f644; display:flex; align-items:center; justify-content:center; font-size:20px; }
        .tl-title { margin:0; font-size:28px; font-weight:800; font-family:'Sora',sans-serif; color:#e8edf5; letter-spacing:-0.5px; }
        .tl-subtitle { margin:0; font-size:14px; color:#3d5060; margin-left:56px; }

        .tl-stats { display:flex; gap:16px; margin-bottom:28px; }
        .tl-stat { background:#0a111e; border:1px solid #1e2d45; border-radius:14px; padding:18px 24px; flex:1; position:relative; overflow:hidden; }
        .tl-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; border-radius:2px 2px 0 0; background:var(--c); }
        .tl-stat-val { font-size:30px; font-weight:800; font-family:'Sora',sans-serif; color:var(--c); }
        .tl-stat-label { font-size:11px; color:#3d5060; font-weight:700; margin-top:2px; text-transform:uppercase; letter-spacing:.08em; }

        .tl-controls { display:flex; align-items:center; gap:12px; margin-bottom:24px; flex-wrap:wrap; }
        .tl-search-wrap { position:relative; flex:1; min-width:200px; max-width:380px; }
        .tl-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#3d5060; pointer-events:none; font-size:14px; }
        .tl-search { width:100%; box-sizing:border-box; padding:0 14px 0 36px; height:42px; background:#0a111e; border:1px solid #1e2d45; border-radius:10px; color:#c8d6e8; font-size:14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; }
        .tl-search:focus { border-color:#3b82f6; }
        .tl-count { margin-left:auto; font-size:13px; color:#3d5060; white-space:nowrap; }

        .tl-table-wrap { background:#0a111e; border:1px solid #1e2d45; border-radius:16px; overflow:hidden; }
        .tl-table { width:100%; border-collapse:collapse; }
        .tl-thead th { padding:14px 20px; text-align:left; font-size:11px; font-weight:700; color:#3d5060; text-transform:uppercase; letter-spacing:.08em; border-bottom:1px solid #1e2d45; background:#080d18; white-space:nowrap; }
        .tl-tbody tr { transition:background .15s; }
        .tl-tbody tr:hover { background:#0d1625; }
        .tl-tbody tr:not(:last-child) td { border-bottom:1px solid #111d2e; }
        .tl-tbody td { padding:14px 20px; font-size:14px; color:#c8d6e8; vertical-align:middle; }
        .tl-task-name { font-weight:600; color:#e8edf5; margin-bottom:2px; }
        .tl-process-name { font-size:12px; color:#5a6a85; }
        .tl-req { font-family:'Sora',sans-serif; font-size:13px; font-weight:700; color:#8b5cf6; }
        .tl-assign { font-size:13px; color:#5a6a85; }
        .tl-assign.unassigned { color:#e05c5c; font-style:italic; }
        .tl-badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; border:1px solid; white-space:nowrap; }

        /* Row action buttons */
        .tl-row-actions { display:flex; align-items:center; gap:6px; flex-wrap:nowrap; }
        .tl-action-btn { padding:0 12px; height:30px; border-radius:7px; border:1px solid; background:transparent; font-size:12px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; white-space:nowrap; transition:all .15s; }
        .tl-action-btn-detail  { color:#5a6a85; border-color:#1e2d45; }
        .tl-action-btn-detail:hover  { color:#c8d6e8; border-color:#3b82f655; background:#3b82f610; }
        .tl-action-btn-take   { color:#10b981; border-color:#10b98130; }
        .tl-action-btn-take:hover   { background:#10b98115; border-color:#10b98155; }
        .tl-action-btn-reassign { color:#f59e0b; border-color:#f59e0b30; }
        .tl-action-btn-reassign:hover { background:#f59e0b15; border-color:#f59e0b55; }

        .tl-empty { text-align:center; padding:80px 0; color:#2a3d58; }
        .tl-empty-icon { font-size:48px; margin-bottom:12px; }
        .tl-empty-text { font-size:15px; }

        .tl-skeleton-row td { padding:18px 20px; }
        .tl-skeleton-bar { height:14px; border-radius:6px; background:#111d2e; animation:tlPulse 1.4s ease-in-out infinite; }

        .tl-pagination { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-top:1px solid #1e2d45; }
        .tl-page-info { font-size:13px; color:#3d5060; }
        .tl-page-btns { display:flex; align-items:center; gap:4px; }
        .tl-page-btn { width:34px; height:34px; border-radius:8px; border:1px solid #1e2d45; background:transparent; color:#5a6a85; font-size:13px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s; font-family:'DM Sans',sans-serif; }
        .tl-page-btn:hover:not(:disabled) { border-color:#3b82f655; color:#c8d6e8; }
        .tl-page-btn.current { background:#3b82f615; border-color:#3b82f655; color:#3b82f6; font-weight:700; }
        .tl-page-btn:disabled { opacity:.3; cursor:default; }
        .tl-page-ellipsis { color:#3d5060; font-size:13px; padding:0 4px; }

        /* Detail side panel */
        .tl-panel-overlay { position:fixed; inset:0; z-index:200; background:rgba(5,8,16,.6); backdrop-filter:blur(4px); display:flex; align-items:stretch; justify-content:flex-end; animation:tlFadeIn .2s ease; }
        .tl-panel { width:min(480px,95vw); height:100vh; background:#080d18; border-left:1px solid #1e2d45; display:flex; flex-direction:column; animation:tlSlideIn .28s cubic-bezier(.16,1,.3,1); overflow-y:auto; }
        .tl-panel-header { padding:20px 24px; border-bottom:1px solid #1e2d45; display:flex; align-items:flex-start; justify-content:space-between; gap:16px; position:sticky; top:0; background:#080d18; z-index:1; }
        .tl-panel-title { font-size:16px; font-weight:700; color:#e8edf5; font-family:'Sora',sans-serif; margin:0 0 4px; }
        .tl-panel-sub { font-size:12px; color:#3d5060; margin:0; }
        .tl-panel-close { background:none; border:1px solid #1e2d45; color:#5a6a85; cursor:pointer; width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:18px; transition:all .15s; flex-shrink:0; }
        .tl-panel-close:hover { border-color:#3b82f644; color:#e8edf5; }
        .tl-panel-body { padding:24px; display:flex; flex-direction:column; gap:16px; }
        .tl-panel-section { background:#0a111e; border:1px solid #1e2d45; border-radius:12px; padding:20px; }
        .tl-panel-section-title { font-size:11px; font-weight:700; color:#3d5060; text-transform:uppercase; letter-spacing:.08em; margin:0 0 14px; }
        .tl-panel-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; }
        .tl-panel-row:not(:last-child) { border-bottom:1px solid #111d2e; }
        .tl-panel-key { font-size:12px; color:#5a6a85; }
        .tl-panel-val { font-size:13px; color:#c8d6e8; font-weight:500; text-align:right; max-width:60%; word-break:break-word; }
        .tl-panel-val.highlight { color:#8b5cf6; font-family:'Sora',sans-serif; font-weight:700; }
        .tl-panel-actions { display:flex; gap:8px; flex-wrap:wrap; }
        .tl-panel-action-btn { flex:1; padding:10px 0; border-radius:8px; border:1px solid; background:transparent; font-size:13px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .tl-panel-action-take { color:#10b981; border-color:#10b98130; }
        .tl-panel-action-take:hover { background:#10b98115; }
        .tl-panel-action-reassign { color:#f59e0b; border-color:#f59e0b30; }
        .tl-panel-action-reassign:hover { background:#f59e0b15; }

        /* Iframe panel */
        .tl-iframe-overlay { position:fixed; inset:0; z-index:300; background:rgba(5,8,16,.9); backdrop-filter:blur(6px); display:flex; align-items:stretch; justify-content:flex-end; animation:tlFadeIn .2s ease; }
        .tl-iframe-panel { width:min(960px,95vw); height:100vh; background:#080d18; border-left:1px solid #1e2d45; display:flex; flex-direction:column; animation:tlSlideIn .28s cubic-bezier(.16,1,.3,1); }
        .tl-iframe-panel.fullscreen { width:100vw; border-left:none; }
        .tl-iframe-header { padding:18px 24px; border-bottom:1px solid #1e2d45; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; background:#0a111e; gap:16px; }
        .tl-iframe-info { display:flex; align-items:center; gap:14px; min-width:0; }
        .tl-iframe-icon { font-size:22px; flex-shrink:0; }
        .tl-iframe-name { font-size:15px; font-weight:700; color:#e8edf5; font-family:'Sora',sans-serif; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .tl-iframe-sub { font-size:12px; color:#3d5060; margin-top:2px; }
        .tl-iframe-btns { display:flex; align-items:center; gap:8px; }
        .tl-iframe-btn { background:none; border:1px solid #1e2d45; color:#5a6a85; cursor:pointer; width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; transition:all .15s; flex-shrink:0; }
        .tl-iframe-btn:hover { border-color:#3b82f644; color:#e8edf5; }
        .tl-iframe-body { flex:1; position:relative; overflow:hidden; }
        .tl-iframe { width:100%; height:100%; border:none; display:block; transition:opacity .3s; }
        .tl-iframe-loading { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; color:#3d5060; font-size:14px; pointer-events:none; }
        .tl-iframe-spinner { width:36px; height:36px; border:3px solid #1e2d45; border-top-color:#10b981; border-radius:50%; animation:tlSpin .7s linear infinite; }

        /* Reassign panel */
        .tl-reassign-overlay { position:fixed; inset:0; z-index:300; background:rgba(5,8,16,.7); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; animation:tlFadeIn .2s ease; }
        .tl-reassign-modal { background:#0a111e; border:1px solid #1e2d45; border-radius:16px; padding:28px; width:min(420px,92vw); animation:tlScaleIn .22s cubic-bezier(.16,1,.3,1); }
        .tl-reassign-title { font-size:17px; font-weight:700; color:#e8edf5; font-family:'Sora',sans-serif; margin:0 0 4px; }
        .tl-reassign-sub { font-size:13px; color:#3d5060; margin:0 0 22px; }
        .tl-reassign-label { font-size:12px; font-weight:600; color:#5a6a85; text-transform:uppercase; letter-spacing:.06em; display:block; margin-bottom:8px; }
        .tl-reassign-input { width:100%; box-sizing:border-box; padding:0 14px; height:42px; background:#060b14; border:1px solid #1e2d45; border-radius:10px; color:#c8d6e8; font-size:14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; }
        .tl-reassign-input:focus { border-color:#f59e0b; }
        .tl-reassign-footer { display:flex; gap:8px; margin-top:20px; }
        .tl-reassign-cancel { flex:1; padding:10px 0; border-radius:8px; border:1px solid #1e2d45; background:transparent; color:#5a6a85; font-size:13px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .tl-reassign-cancel:hover { border-color:#3b82f644; color:#c8d6e8; }
        .tl-reassign-confirm { flex:2; padding:10px 0; border-radius:8px; border:1px solid #f59e0b40; background:#f59e0b15; color:#f59e0b; font-size:13px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .tl-reassign-confirm:hover { background:#f59e0b25; }
        .tl-reassign-confirm:disabled { opacity:.4; cursor:default; }

        .tl-error { background:#ef444412; border:1px solid #ef444430; border-radius:12px; padding:20px 24px; color:#ef4444; display:flex; align-items:center; gap:12px; margin-bottom:24px; }
        .tl-error-icon { font-size:20px; flex-shrink:0; }
        .tl-retry-btn { margin-left:auto; padding:6px 14px; border-radius:8px; border:1px solid #ef444440; background:transparent; color:#ef4444; font-size:12px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .tl-retry-btn:hover { background:#ef444415; }

        @keyframes tlPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes tlFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes tlSlideIn { from{transform:translateX(60px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes tlScaleIn { from{transform:scale(.94);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes tlSpin { to{transform:rotate(360deg)} }

        @media (max-width:768px) {
          .tl-root { padding:24px 16px; }
          .tl-stats { flex-direction:column; }
          .tl-table-wrap { overflow-x:auto; }
          .tl-panel, .tl-iframe-panel { width:100vw; }
          .tl-thead th:nth-child(4), .tl-tbody td:nth-child(4) { display:none; }
        }
      `}</style>

      <div>
        <AppBar position="static" sx={{ bgcolor: "#0a111e", borderBottom: "1px solid #1e2d45", boxShadow: "none" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ zIndex: 10 }} onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>
              Mis Tareas
            </Typography>
            <Button color="inherit" variant="outlined" size="small" onClick={() => router.push("/pages/portal")}>
              Portal
            </Button>
          </Toolbar>
        </AppBar>

        {sidebarOpen && (
          <NavMenu sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} contTramites={0} handleContTramites={() => {}} />
        )}

        <div className="tl-root">
          <div className="tl-header">
            <div className="tl-header-row">
              <div className="tl-header-icon">📋</div>
              <h1 className="tl-title">Mis Tareas</h1>
            </div>
            <p className="tl-subtitle">
              {user ? `Tareas asignadas a ${user}` : "Usuario no identificado en sesión"}
            </p>
          </div>

          <div className="tl-stats">
            {[
              { label: "Total",           value: tasks.length, color: "#8b5cf6" },
              { label: "Alta prioridad",  value: highCount,    color: "#ef4444" },
              { label: "Con vencimiento", value: withDueDate,  color: "#f59e0b" },
            ].map((s) => (
              <div key={s.label} className="tl-stat" style={{ "--c": s.color } as React.CSSProperties}>
                <div className="tl-stat-val">{loading ? "—" : s.value}</div>
                <div className="tl-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {error && (
            <div className="tl-error">
              <span className="tl-error-icon">⚠️</span>
              <span>{error}</span>
              <button className="tl-retry-btn" onClick={() => fetchTasks(user)}>Reintentar</button>
            </div>
          )}

          <div className="tl-controls">
            <div className="tl-search-wrap">
              <span className="tl-search-icon">🔍</span>
              <input
                className="tl-search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Buscar por nombre, ID de tarea o instancia…"
              />
            </div>
            <span className="tl-count">{filtered.length} tarea{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="tl-table-wrap">
            <table className="tl-table">
              <thead className="tl-thead">
                <tr>
                  <th>Tarea</th>
                  <th>Instancia</th>
                  <th>Prioridad</th>
                  <th>Vencimiento</th>
                  <th>Usuario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="tl-tbody">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="tl-skeleton-row">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j}><div className="tl-skeleton-bar" style={{ width: `${[70, 40, 35, 45, 40, 60][j]}%` }} /></td>
                      ))}
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="tl-empty">
                        <div className="tl-empty-icon">📭</div>
                        <div className="tl-empty-text">
                          {tasks.length === 0 ? "No tienes tareas pendientes" : "No hay tareas que coincidan con la búsqueda"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((task) => {
                    const pBadge = priorityBadge(task.TASK_PRIORITY);
                    return (
                      <tr key={task.TASK_ID}>
                        <td>
                          <div className="tl-task-name">{task.TASK_NAME || "Sin nombre"}</div>
                          <div className="tl-process-name">ID: {task.TASK_ID}</div>
                        </td>
                        <td>
                          <span className="tl-req">#{task.INSTANCE_ID}</span>
                        </td>
                        <td>
                          <span className="tl-badge" style={{ background: pBadge.bg, color: pBadge.text, borderColor: pBadge.border }}>
                            {pBadge.label} ({task.TASK_PRIORITY})
                          </span>
                        </td>
                        <td>
                          <span className={`tl-assign${!task.TASK_DUE_DATE ? " unassigned" : ""}`}>
                            {task.TASK_DUE_DATE || "Sin fecha"}
                          </span>
                        </td>
                        <td>
                          <span className="tl-assign">{task.USER_NAME || "—"}</span>
                        </td>
                        <td>
                          <div className="tl-row-actions">
                            <button
                              className="tl-action-btn tl-action-btn-detail"
                              onClick={() => setDetailTask(task)}
                            >
                              Detalle
                            </button>
                            <button
                              className="tl-action-btn tl-action-btn-take"
                              onClick={() => openIframe(task)}
                            >
                              {task.USER_NAME ? "Continuar" : "Tomar"}
                            </button>
                            <button
                              className="tl-action-btn tl-action-btn-reassign"
                              onClick={() => openReassign(task)}
                            >
                              Reasignar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {!loading && filtered.length > 0 && (
              <div className="tl-pagination">
                <span className="tl-page-info">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
                </span>
                <div className="tl-page-btns">
                  <button className="tl-page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Anterior">‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "…" ? (
                        <span key={`e${i}`} className="tl-page-ellipsis">…</span>
                      ) : (
                        <button key={p} className={`tl-page-btn${p === page ? " current" : ""}`} onClick={() => setPage(p as number)}>{p}</button>
                      )
                    )}
                  <button className="tl-page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Siguiente">›</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Detail panel ── */}
      {detailTask && (
        <div className="tl-panel-overlay" onClick={(e) => e.target === e.currentTarget && setDetailTask(null)}>
          <div className="tl-panel">
            <div className="tl-panel-header">
              <div>
                <p className="tl-panel-title">{detailTask.TASK_NAME || "Tarea"}</p>
                <p className="tl-panel-sub">Instancia #{detailTask.INSTANCE_ID}</p>
              </div>
              <button className="tl-panel-close" onClick={() => setDetailTask(null)} aria-label="Cerrar">×</button>
            </div>
            <div className="tl-panel-body">
              <div className="tl-panel-section">
                <p className="tl-panel-section-title">Información general</p>
                {[
                  { key: "ID de Tarea", val: detailTask.TASK_ID, highlight: true },
                  { key: "Instancia",   val: `#${detailTask.INSTANCE_ID}` },
                  { key: "Usuario",     val: detailTask.USER_NAME },
                ].map(({ key, val, highlight }) => (
                  <div key={key} className="tl-panel-row">
                    <span className="tl-panel-key">{key}</span>
                    <span className={`tl-panel-val${highlight ? " highlight" : ""}`}>{val || "—"}</span>
                  </div>
                ))}
              </div>
              <div className="tl-panel-section">
                <p className="tl-panel-section-title">Prioridad y vencimiento</p>
                {[
                  { key: "Prioridad",   val: `${priorityBadge(detailTask.TASK_PRIORITY).label} (${detailTask.TASK_PRIORITY})` },
                  { key: "Vencimiento", val: detailTask.TASK_DUE_DATE || "Sin fecha límite" },
                ].map(({ key, val }) => (
                  <div key={key} className="tl-panel-row">
                    <span className="tl-panel-key">{key}</span>
                    <span className="tl-panel-val">{val}</span>
                  </div>
                ))}
              </div>
              <div className="tl-panel-actions">
                <button className="tl-panel-action-btn tl-panel-action-take" onClick={() => { setDetailTask(null); openIframe(detailTask); }}>
                  {detailTask.USER_NAME ? "Continuar tarea" : "Tomar tarea"}
                </button>
                <button className="tl-panel-action-btn tl-panel-action-reassign" onClick={() => { setDetailTask(null); openReassign(detailTask); }}>
                  Reasignar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Iframe panel (Take / Continue) ── */}
      {iframeTask && (
        <div className="tl-iframe-overlay" onClick={(e) => e.target === e.currentTarget && closeIframe()}>
          <div className={`tl-iframe-panel${fullscreen ? " fullscreen" : ""}`}>
            <div className="tl-iframe-header">
              <div className="tl-iframe-info">
                <span className="tl-iframe-icon">✅</span>
                <div>
                  <div className="tl-iframe-name">{iframeTask.TASK_NAME}</div>
                  <div className="tl-iframe-sub">Instancia #{iframeTask.INSTANCE_ID} · Tarea {iframeTask.TASK_ID}</div>
                </div>
              </div>
              <div className="tl-iframe-btns">
                <button className="tl-iframe-btn" onClick={() => setFullscreen((f) => !f)} aria-label={fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
                  {fullscreen ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                    </svg>
                  )}
                </button>
                <button className="tl-iframe-btn" onClick={closeIframe} aria-label="Cerrar" style={{ fontSize: 20 }}>×</button>
              </div>
            </div>
            <div className="tl-iframe-body">
              {iframeLoading && (
                <div className="tl-iframe-loading">
                  <div className="tl-iframe-spinner" />
                  <span>Cargando tarea…</span>
                </div>
              )}
              <iframe
                src={`/api/workflow/process/task/form?taskId=${encodeURIComponent(iframeTask.TASK_ID)}&instanceId=${encodeURIComponent(iframeTask.INSTANCE_ID)}`}
                className="tl-iframe"
                style={{ opacity: iframeLoading ? 0 : 1 }}
                onLoad={() => setIframeLoading(false)}
                title={iframeTask.TASK_NAME}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Reassign modal ── */}
      {reassignTask && (
        <div className="tl-reassign-overlay" onClick={(e) => e.target === e.currentTarget && setReassignTask(null)}>
          <div className="tl-reassign-modal">
            <p className="tl-reassign-title">Reasignar tarea</p>
            <p className="tl-reassign-sub">{reassignTask.TASK_NAME} · Instancia #{reassignTask.INSTANCE_ID}</p>
            <label className="tl-reassign-label">Nuevo usuario</label>
            <input
              className="tl-reassign-input"
              value={reassignUser}
              onChange={(e) => setReassignUser(e.target.value)}
              placeholder="Ingresa el nombre de usuario…"
              autoFocus
            />
            <div className="tl-reassign-footer">
              <button className="tl-reassign-cancel" onClick={() => setReassignTask(null)}>Cancelar</button>
              <button
                className="tl-reassign-confirm"
                disabled={!reassignUser.trim()}
                onClick={() => {
                  // TODO: call reassign API with reassignTask.TASK_ID and reassignUser
                  setReassignTask(null);
                }}
              >
                Confirmar reasignación
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
