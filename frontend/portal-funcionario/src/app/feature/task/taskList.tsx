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
import "./taskList.css";

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
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
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
    setIframeUrl(null);
    setIframeTask(task);
    AdminServices.GetTaskFormLink(task.TASK_ID)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const url = (data?.taskInformation?.[0]?.TASK_FORM_URL ?? null)  + "?&taskId=" + task.TASK_ID;
        setIframeUrl(url);
        if (!url) setIframeLoading(false);
      })
      .catch(() => setIframeLoading(false));
  };

  const closeIframe = () => { setIframeTask(null); setIframeUrl(null); setFullscreen(false); };

  const openReassign = (task: Task) => { setReassignTask(task); setReassignUser(""); };

  return (
    <>
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

        <div className="root">
          <div className="header">
            <div className="header-row">
              <div className="header-icon">📋</div>
              <h1 className="title">Mis Tareas</h1>
            </div>
            <p className="subtitle">
              {user ? `Tareas asignadas a ${user}` : "Usuario no identificado en sesión"}
            </p>
          </div>

          <div className="stats">
            {[
              { label: "Total",           value: tasks.length, color: "#8b5cf6" },
              { label: "Alta prioridad",  value: highCount,    color: "#ef4444" },
              { label: "Con vencimiento", value: withDueDate,  color: "#f59e0b" },
            ].map((s) => (
              <div key={s.label} className="stat" style={{ "--c": s.color } as React.CSSProperties}>
                <div className="stat-val">{loading ? "—" : s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {error && (
            <div className="error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
              <button className="retry-btn" onClick={() => fetchTasks(user)}>Reintentar</button>
            </div>
          )}

          <div className="controls">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Buscar por nombre, ID de tarea o instancia…"
              />
            </div>
            <span className="count">{filtered.length} tarea{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead className="thead">
                <tr>
                  <th>Tarea</th>
                  <th>Instancia</th>
                  <th>Prioridad</th>
                  <th>Vencimiento</th>
                  <th>Usuario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="tbody">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="skeleton-row">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j}><div className="skeleton-bar" style={{ width: `${[70, 40, 35, 45, 40, 60][j]}%` }} /></td>
                      ))}
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty">
                        <div className="empty-icon">📭</div>
                        <div className="empty-text">
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
                          <div className="task-name">{task.TASK_NAME || "Sin nombre"}</div>
                          <div className="process-name">ID: {task.TASK_ID}</div>
                        </td>
                        <td>
                          <span className="req">#{task.INSTANCE_ID}</span>
                        </td>
                        <td>
                          <span className="badge" style={{ background: pBadge.bg, color: pBadge.text, borderColor: pBadge.border }}>
                            {pBadge.label} ({task.TASK_PRIORITY})
                          </span>
                        </td>
                        <td>
                          <span className={`assign${!task.TASK_DUE_DATE ? " unassigned" : ""}`}>
                            {task.TASK_DUE_DATE || "Sin fecha"}
                          </span>
                        </td>
                        <td>
                          <span className="assign">{task.USER_NAME || "—"}</span>
                        </td>
                        <td>
                          <div className="row-actions">
                            <button
                              className="action-btn action-btn-detail"
                              onClick={() => setDetailTask(task)}
                            >
                              Detalle
                            </button>
                            <button
                              className="action-btn action-btn-take"
                              onClick={() => openIframe(task)}
                            >
                              {task.USER_NAME ? "Continuar" : "Tomar"}
                            </button>
                            <button
                              className="action-btn action-btn-reassign"
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
              <div className="pagination">
                <span className="page-info">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
                </span>
                <div className="page-btns">
                  <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Anterior">‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "…" ? (
                        <span key={`e${i}`} className="page-ellipsis">…</span>
                      ) : (
                        <button key={p} className={`page-btn${p === page ? " current" : ""}`} onClick={() => setPage(p as number)}>{p}</button>
                      )
                    )}
                  <button className="page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Siguiente">›</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Detail panel ── */}
      {detailTask && (
        <div className="panel-overlay" onClick={(e) => e.target === e.currentTarget && setDetailTask(null)}>
          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-title">{detailTask.TASK_NAME || "Tarea"}</p>
                <p className="panel-sub">Instancia #{detailTask.INSTANCE_ID}</p>
              </div>
              <button className="panel-close" onClick={() => setDetailTask(null)} aria-label="Cerrar">×</button>
            </div>
            <div className="panel-body">
              <div className="panel-section">
                <p className="panel-section-title">Información general</p>
                {[
                  { key: "ID de Tarea", val: detailTask.TASK_ID, highlight: true },
                  { key: "Instancia",   val: `#${detailTask.INSTANCE_ID}` },
                  { key: "Usuario",     val: detailTask.USER_NAME },
                ].map(({ key, val, highlight }) => (
                  <div key={key} className="panel-row">
                    <span className="panel-key">{key}</span>
                    <span className={`panel-val${highlight ? " highlight" : ""}`}>{val || "—"}</span>
                  </div>
                ))}
              </div>
              <div className="panel-section">
                <p className="panel-section-title">Prioridad y vencimiento</p>
                {[
                  { key: "Prioridad",   val: `${priorityBadge(detailTask.TASK_PRIORITY).label} (${detailTask.TASK_PRIORITY})` },
                  { key: "Vencimiento", val: detailTask.TASK_DUE_DATE || "Sin fecha límite" },
                ].map(({ key, val }) => (
                  <div key={key} className="panel-row">
                    <span className="panel-key">{key}</span>
                    <span className="panel-val">{val}</span>
                  </div>
                ))}
              </div>
              <div className="panel-actions">
                <button className="panel-action-btn panel-action-take" onClick={() => { setDetailTask(null); openIframe(detailTask); }}>
                  {detailTask.USER_NAME ? "Continuar tarea" : "Tomar tarea"}
                </button>
                <button className="panel-action-btn panel-action-reassign" onClick={() => { setDetailTask(null); openReassign(detailTask); }}>
                  Reasignar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Iframe panel (Take / Continue) ── */}
      {iframeTask && (
        <div className="iframe-overlay" onClick={(e) => e.target === e.currentTarget && closeIframe()}>
          <div className={`iframe-panel${fullscreen ? " fullscreen" : ""}`}>
            <div className="iframe-header">
              <div className="iframe-info">
                <span className="iframe-icon">✅</span>
                <div>
                  <div className="iframe-name">{iframeTask.TASK_NAME}</div>
                  <div className="iframe-sub">Instancia #{iframeTask.INSTANCE_ID} · Tarea {iframeTask.TASK_ID}</div>
                </div>
              </div>
              <div className="iframe-btns">
                <button className="iframe-btn" onClick={() => setFullscreen((f) => !f)} aria-label={fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
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
                <button className="iframe-btn" onClick={closeIframe} aria-label="Cerrar" style={{ fontSize: 20 }}>×</button>
              </div>
            </div>
            <div className="iframe-body">
              {iframeLoading && (
                <div className="iframe-loading">
                  <div className="iframe-spinner" />
                  <span>Cargando tarea…</span>
                </div>
              )}
              {iframeUrl && (
                <iframe
                  src={iframeUrl}
                  className="iframe"
                  style={{ opacity: iframeLoading ? 0 : 1 }}
                  onLoad={() => setIframeLoading(false)}
                  title={iframeTask.TASK_NAME}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Reassign modal ── */}
      {reassignTask && (
        <div className="reassign-overlay" onClick={(e) => e.target === e.currentTarget && setReassignTask(null)}>
          <div className="reassign-modal">
            <p className="reassign-title">Reasignar tarea</p>
            <p className="reassign-sub">{reassignTask.TASK_NAME} · Instancia #{reassignTask.INSTANCE_ID}</p>
            <label className="reassign-label">Nuevo usuario</label>
            <input
              className="reassign-input"
              value={reassignUser}
              onChange={(e) => setReassignUser(e.target.value)}
              placeholder="Ingresa el nombre de usuario…"
              autoFocus
            />
            <div className="reassign-footer">
              <button className="reassign-cancel" onClick={() => setReassignTask(null)}>Cancelar</button>
              <button
                className="reassign-confirm"
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
