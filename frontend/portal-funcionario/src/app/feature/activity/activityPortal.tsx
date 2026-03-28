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

type Activity = {
  id: string;
  name: string;
  description?: string;
  href?: string;
  type?: string;
  active: boolean;
};

type ActivityPayload = {
  name: string;
  description: string;
  active: boolean;
  href: string;
  type: string;
};

const SEED_ACTIVITIES: Activity[] = [
  { id: "1", name: "Revisión de documentos", description: "Revisar documentos recibidos", active: true },
  { id: "2", name: "Aprobación", description: "Aprobar solicitudes pendientes", active: true },
  { id: "3", name: "Notificación", description: "Enviar notificaciones al usuario", active: true },
  { id: "4", name: "Archivo", description: "Archivar expediente completado", active: false },
];

const ACCENT = "#3b82f6";

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="ap-overlay">
      <div className="ap-modal">
        <div className="ap-modal-header">
          <h2 className="ap-modal-title">{title}</h2>
          <button className="ap-modal-close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ActivityForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial?: Activity;
  onSave: (data: ActivityPayload) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [href, setHref] = useState(initial?.href ?? "");
  const [type, setType] = useState(initial?.type ?? "");
  const valid = name.trim().length > 0;

  return (
    <div className="ap-form">
      <div className="ap-field">
        <label className="ap-label">Activity Name</label>
        <input
          className="ap-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Document Review"
        />
      </div>
      <div className="ap-field">
        <label className="ap-label">Activity Type</label>
        <input
          className="ap-input"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="e.g. Type"
        />
      </div>
      <div className="ap-field">
        <label className="ap-label">Activity Link</label>
        <input
          className="ap-input"
          value={href}
          onChange={(e) => setHref(e.target.value)}
          placeholder="e.g. http://"
        />
      </div>
      <div className="ap-field">
        <label className="ap-label">Description</label>
        <textarea
          className="ap-input ap-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this activity's purpose..."
          rows={3}
        />
      </div>
      <div className="ap-field ap-field-inline">
        <label className="ap-label">Active</label>
        <div
          className={`ap-toggle ${active ? "on" : ""}`}
          onClick={() => setActive((v) => !v)}
          role="switch"
          aria-checked={active}
        >
          <div className="ap-toggle-thumb" />
        </div>
        <span className="ap-toggle-label">{active ? "Active" : "Inactive"}</span>
      </div>
      <div className="ap-form-actions">
        <button type="button" className="ap-btn-ghost" onClick={onCancel}>Cancel</button>
        <button
          type="button"
          className="ap-btn-primary"
          disabled={!valid || isSaving}
          onClick={() => valid && onSave({ name: name.trim(), description: description.trim(), type: type.trim(), href: href.trim(), active })}
        >
          {isSaving ? "Saving…" : initial ? "Save Changes" : "Create Activity"}
        </button>
      </div>
    </div>
  );
}

export default function ActivityPortal() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "warn" | "err" } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    AdminServices.GetActivities()
      .then((res) => res.json())
      .then((data) => {
        setActivities(Array.isArray(data) ? data : Array.isArray(data.activities) ? data.activities : SEED_ACTIVITIES);
      })
      .catch(() => setActivities(SEED_ACTIVITIES))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string, type: "ok" | "warn" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeModal = () => {
    setModal(null);
    setActiveActivity(null);
  };

  const handleAdd = async (payload: ActivityPayload) => {
    setIsSaving(true);
    try {
      const res = await AdminServices.CreateActivity(payload);
      const optimistic: Activity = { ...payload, id: String(Date.now()) };
      if (res.ok) {
        try {
          const created: Activity = await res.json();
          setActivities((prev) => [...prev, created]);
        } catch {
          setActivities((prev) => [...prev, optimistic]);
        }
      } else {
        setActivities((prev) => [...prev, optimistic]);
      }
      showToast(`Activity "${payload.name}" created`);
    } catch {
      const optimistic: Activity = { ...payload, id: String(Date.now()) };
      setActivities((prev) => [...prev, optimistic]);
      showToast(`Activity "${payload.name}" created`);
    } finally {
      setIsSaving(false);
      closeModal();
    }
  };

  const handleUpdate = async (payload: ActivityPayload) => {
    if (!activeActivity) return;
    setIsSaving(true);
    try {
      await AdminServices.UpdateActivity(activeActivity.id, payload);
      setActivities((prev) =>
        prev.map((a) => (a.id === activeActivity.id ? { ...a, ...payload } : a))
      );
      showToast(`Activity "${payload.name}" updated`);
    } catch {
      setActivities((prev) =>
        prev.map((a) => (a.id === activeActivity.id ? { ...a, ...payload } : a))
      );
      showToast(`Activity "${payload.name}" updated`);
    } finally {
      setIsSaving(false);
      closeModal();
    }
  };

  const handleDelete = async () => {
    if (!activeActivity) return;
    setIsSaving(true);
    try {
      await AdminServices.DeleteActivity(activeActivity.id);
    } catch {}
    finally {
      setActivities((prev) => prev.filter((a) => a.id !== activeActivity.id));
      showToast(`Activity "${activeActivity.name}" deleted`, "warn");
      setIsSaving(false);
      closeModal();
    }
  };

  const filtered = activities.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = activities.filter((a) => a.active).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap');
        .ap-root { min-height:100vh; background:#060b14; font-family:'DM Sans',sans-serif; color:#c8d6e8; padding:40px 48px; }
        .ap-header { margin-bottom:36px; }
        .ap-header-row { display:flex; align-items:center; gap:14px; margin-bottom:6px; }
        .ap-icon { width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg,#3b82f622,#3b82f644); border:1px solid #3b82f644; display:flex; align-items:center; justify-content:center; font-size:18px; }
        .ap-title { margin:0; font-size:26px; font-weight:800; font-family:'Sora',sans-serif; color:#e8edf5; letter-spacing:-0.5px; }
        .ap-subtitle { margin:0; font-size:14px; color:#3d5060; margin-left:52px; }
        .ap-stats { display:flex; gap:16px; margin-bottom:32px; }
        .ap-stat { background:#0a111e; border:1px solid #1e2d45; border-radius:12px; padding:16px 24px; flex:1; }
        .ap-stat-val { font-size:26px; font-weight:800; font-family:'Sora',sans-serif; }
        .ap-stat-label { font-size:12px; color:#3d5060; font-weight:600; margin-top:2px; text-transform:uppercase; letter-spacing:.06em; }
        .ap-controls { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; gap:16px; }
        .ap-search-wrap { position:relative; flex:1; max-width:320px; }
        .ap-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#3d5060; font-size:15px; pointer-events:none; }
        .ap-search { width:100%; box-sizing:border-box; padding-left:36px; padding-right:14px; height:40px; background:#0a111e; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; }
        .ap-search:focus { border-color:${ACCENT}; }
        .ap-btn-primary { padding:9px 22px; border-radius:8px; font-size:13px; font-weight:700; border:none; background:linear-gradient(135deg,#3b82f6,#2563eb); color:#fff; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 4px 18px rgba(59,130,246,.2); transition:all .15s; }
        .ap-btn-primary:hover:not(:disabled) { box-shadow:0 6px 24px rgba(59,130,246,.35); }
        .ap-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
        .ap-table-wrap { background:#0a111e; border:1px solid #1e2d45; border-radius:14px; overflow:hidden; }
        .ap-table { width:100%; border-collapse:collapse; }
        .ap-th { padding:14px 16px; text-align:left; font-size:11px; font-weight:700; color:#3d5060; text-transform:uppercase; letter-spacing:.08em; border-bottom:1px solid #1e2d45; }
        .ap-tr { border-bottom:1px solid #111d2e; transition:background .12s; }
        .ap-tr:last-child { border-bottom:none; }
        .ap-tr:hover .ap-td { background:#0d1829; }
        .ap-td { padding:14px 16px; background:transparent; transition:background .12s; }
        .ap-name { font-weight:700; color:#e8edf5; font-size:14px; font-family:'Sora',sans-serif; }
        .ap-desc { font-size:13px; color:#5a6a85; max-width:260px; }
        .ap-badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }
        .ap-badge-active { background:#10b98115; color:#10b981; border:1px solid #10b98130; }
        .ap-badge-inactive { background:#e05c5c12; color:#e05c5c; border:1px solid #e05c5c30; }
        .ap-row-actions { display:flex; gap:6px; }
        .ap-btn-row { padding:6px 14px; border-radius:7px; font-size:12px; font-weight:600; border:1px solid #1e2d45; background:transparent; color:#8a9ab5; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .ap-btn-row.edit:hover { border-color:#3b82f644; color:#3b82f6; }
        .ap-btn-row.del:hover { border-color:#e05c5c44; color:#e05c5c; }
        .ap-empty { padding:52px; text-align:center; color:#2a3d58; font-size:14px; }
        .ap-footer { margin-top:14px; font-size:12px; color:#2a3d58; }
        .ap-overlay { position:fixed; inset:0; z-index:100; background:rgba(5,8,16,.82); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); animation:apFadeIn .18s ease; }
        .ap-modal { background:#0f1623; border:1px solid #1e2d45; border-radius:16px; padding:36px 40px; min-width:480px; max-width:540px; width:100%; box-shadow:0 30px 80px rgba(0,0,0,.6); animation:apSlideUp .22s cubic-bezier(.16,1,.3,1); }
        .ap-modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:28px; }
        .ap-modal-title { margin:0; font-size:20px; font-weight:700; font-family:'Sora',sans-serif; color:#e8edf5; letter-spacing:-.3px; }
        .ap-modal-close { background:none; border:none; color:#5a6a85; cursor:pointer; font-size:22px; line-height:1; padding:2px 6px; border-radius:6px; transition:color .15s; }
        .ap-modal-close:hover { color:#e8edf5; }
        .ap-form {}
        .ap-field { margin-bottom:18px; }
        .ap-field-inline { display:flex; align-items:center; gap:12px; }
        .ap-field-inline .ap-label { margin-bottom:0; }
        .ap-label { display:block; margin-bottom:7px; font-size:12px; font-weight:600; color:#5a6a85; letter-spacing:.08em; text-transform:uppercase; }
        .ap-input { width:100%; box-sizing:border-box; background:#080d18; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; padding:10px 14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; }
        .ap-input:focus { border-color:${ACCENT}; }
        .ap-textarea { resize:vertical; min-height:72px; }
        .ap-toggle { width:44px; height:24px; border-radius:12px; background:#1e2d45; border:1px solid #2a3d58; cursor:pointer; position:relative; transition:background .2s,border-color .2s; flex-shrink:0; }
        .ap-toggle.on { background:#3b82f630; border-color:#3b82f6; }
        .ap-toggle-thumb { width:18px; height:18px; border-radius:50%; background:#3d5060; position:absolute; top:2px; left:3px; transition:transform .2s,background .2s; }
        .ap-toggle.on .ap-toggle-thumb { transform:translateX(20px); background:#3b82f6; }
        .ap-toggle-label { font-size:13px; color:#5a6a85; }
        .ap-form-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:28px; }
        .ap-btn-ghost { padding:10px 22px; border-radius:8px; font-size:14px; font-weight:600; border:1px solid #1e2d45; background:transparent; color:#5a6a85; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .ap-btn-ghost:hover { border-color:#2a3d58; color:#8a9ab5; }
        .ap-btn-delete { padding:10px 22px; border-radius:8px; font-size:14px; font-weight:700; border:none; background:linear-gradient(135deg,#e05c5c,#c04040); color:#fff; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 4px 18px rgba(224,92,92,.3); transition:all .15s; }
        .ap-btn-delete:disabled { opacity:.5; cursor:not-allowed; }
        .ap-delete-body { margin-bottom:28px; }
        .ap-delete-text { margin:0; color:#8a9ab5; font-size:14px; line-height:1.6; }
        .ap-toast { position:fixed; bottom:32px; right:32px; z-index:999; padding:12px 22px; border-radius:10px; font-size:14px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.5); animation:apToastIn .25s cubic-bezier(.16,1,.3,1); }
        .ap-toast.ok { background:#0d1829; border:1px solid #3b82f644; color:#3b82f6; }
        .ap-toast.warn { background:#2a1a1a; border:1px solid #e05c5c55; color:#e05c5c; }
        .ap-toast.err { background:#2a1a1a; border:1px solid #e05c5c55; color:#e05c5c; }
        .ap-skeleton { height:52px; background:#0d1829; border-radius:6px; animation:apPulse 1.4s ease-in-out infinite; }
        @keyframes apPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes apFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes apSlideUp { from{transform:translateY(22px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes apToastIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @media (max-width:768px) { .ap-root{padding:24px 16px;} .ap-stats{flex-direction:column;} .ap-modal{min-width:unset;padding:24px 20px;} .ap-table-wrap{overflow-x:auto;} }
      `}</style>

      <div>
        <AppBar position="static" sx={{ bgcolor: "#0a111e", borderBottom: "1px solid #1e2d45", boxShadow: "none" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ zIndex: 10 }} onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>
              Gestión de Actividades
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

        <div className="ap-root">
          {toast && (
            <div className={`ap-toast ${toast.type}`}>
              {toast.type === "ok" ? "✓ " : "⚠ "}{toast.msg}
            </div>
          )}

          <div className="ap-header">
            <div className="ap-header-row">
              <div className="ap-icon">⚙️</div>
              <h1 className="ap-title">Activity Management</h1>
            </div>
            <p className="ap-subtitle">Define workflow activities and their configurations</p>
          </div>

          <div className="ap-stats">
            {[
              { label: "Total Activities", value: activities.length, color: ACCENT },
              { label: "Active", value: activeCount, color: "#10b981" },
              { label: "Inactive", value: activities.length - activeCount, color: "#e05c5c" },
            ].map((s) => (
              <div key={s.label} className="ap-stat">
                <div className="ap-stat-val" style={{ color: s.color }}>{s.value}</div>
                <div className="ap-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="ap-controls">
            <div className="ap-search-wrap">
              <span className="ap-search-icon">🔍</span>
              <input
                className="ap-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search activities…"
              />
            </div>
            <button className="ap-btn-primary" onClick={() => setModal("add")}>
              + Add Activity
            </button>
          </div>

          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  {["Name", "Description", "Status", "Actions"].map((h) => (
                    <th key={h} className="ap-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={4} className="ap-td" style={{ padding: "8px 16px" }}>
                        <div className="ap-skeleton" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={4} className="ap-empty">No activities found</td></tr>
                ) : (
                  filtered.map((activity) => (
                    <tr key={activity.id} className="ap-tr">
                      <td className="ap-td"><div className="ap-name">{activity.name}</div></td>
                      <td className="ap-td"><div className="ap-desc">{activity.description ?? "—"}</div></td>
                      <td className="ap-td">
                        <span className={`ap-badge ${activity.active ? "ap-badge-active" : "ap-badge-inactive"}`}>
                          {activity.active ? "● Active" : "○ Inactive"}
                        </span>
                      </td>
                      <td className="ap-td">
                        <div className="ap-row-actions">
                          <button className="ap-btn-row edit" onClick={() => { setActiveActivity(activity); setModal("edit"); }}>Edit</button>
                          <button className="ap-btn-row del" onClick={() => { setActiveActivity(activity); setModal("delete"); }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="ap-footer">Showing {filtered.length} of {activities.length} activities</p>
        </div>
      </div>

      {modal === "add" && (
        <Modal title="Create New Activity" onClose={closeModal}>
          <ActivityForm onSave={handleAdd} onCancel={closeModal} isSaving={isSaving} />
        </Modal>
      )}
      {modal === "edit" && activeActivity && (
        <Modal title="Edit Activity" onClose={closeModal}>
          <ActivityForm initial={activeActivity} onSave={handleUpdate} onCancel={closeModal} isSaving={isSaving} />
        </Modal>
      )}
      {modal === "delete" && activeActivity && (
        <Modal title="Delete Activity" onClose={closeModal}>
          <div className="ap-delete-body">
            <p className="ap-delete-text">
              Are you sure you want to delete the activity{" "}
              <strong style={{ color: "#e8edf5" }}>"{activeActivity.name}"</strong>?
              This will remove it from all associated workflows.
            </p>
          </div>
          <div className="ap-form-actions">
            <button className="ap-btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="ap-btn-delete" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? "Deleting…" : "Delete Activity"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
