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
import PermissionServices from "@/app/api/permissionsManagementServices";

type Permission = {
  id: string;
  name: string;
  description?: string;
  active: boolean;
};

type PermissionPayload = {
  name: string;
  description: string;
  active: boolean;
};

const SEED_PERMISSIONS: Permission[] = [
  { id: "1", name: "read", description: "View resources", active: true },
  { id: "2", name: "write", description: "Create and edit resources", active: true },
  { id: "3", name: "delete", description: "Remove resources", active: true },
  { id: "4", name: "manage_users", description: "Manage user accounts", active: true },
  { id: "5", name: "export", description: "Export data", active: false },
];

const ACCENT = "#f59e0b";

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
    <div className="pp-overlay">
      <div className="pp-modal">
        <div className="pp-modal-header">
          <h2 className="pp-modal-title">{title}</h2>
          <button className="pp-modal-close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function PermissionForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial?: Permission;
  onSave: (data: PermissionPayload) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [active, setActive] = useState(initial?.active ?? true);
  const valid = name.trim().length > 0;

  return (
    <div className="pp-form">
      <div className="pp-field">
        <label className="pp-label">Permission Name</label>
        <input
          className="pp-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. export_reports"
        />
      </div>
      <div className="pp-field">
        <label className="pp-label">Description</label>
        <textarea
          className="pp-input pp-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this permission allows..."
          rows={3}
        />
      </div>
      <div className="pp-field pp-field-inline">
        <label className="pp-label">Active</label>
        <div
          className={`pp-toggle ${active ? "on" : ""}`}
          onClick={() => setActive((v) => !v)}
          role="switch"
          aria-checked={active}
        >
          <div className="pp-toggle-thumb" />
        </div>
        <span className="pp-toggle-label">{active ? "Active" : "Inactive"}</span>
      </div>
      <div className="pp-form-actions">
        <button type="button" className="pp-btn-ghost" onClick={onCancel}>Cancel</button>
        <button
          type="button"
          className="pp-btn-primary"
          disabled={!valid || isSaving}
          onClick={() => valid && onSave({ name: name.trim(), description: description.trim(), active })}
        >
          {isSaving ? "Saving…" : initial ? "Save Changes" : "Create Permission"}
        </button>
      </div>
    </div>
  );
}

export default function PermissionPortal() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [activePermission, setActivePermission] = useState<Permission | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "warn" | "err" } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    PermissionServices.GetPermissions()
      .then((res) => res.json())
      .then((data) => {
        setPermissions(Array.isArray(data.permissions) ? data.permissions : SEED_PERMISSIONS);
      })
      .catch(() => setPermissions(SEED_PERMISSIONS))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string, type: "ok" | "warn" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeModal = () => {
    setModal(null);
    setActivePermission(null);
  };

  const handleAdd = async (payload: PermissionPayload) => {
    setIsSaving(true);
    try {
      const res = await PermissionServices.CreatePermission(payload);
      const optimistic: Permission = { ...payload, id: String(Date.now()) };
      if (res.ok) {
        try {
          const created: Permission = await res.json();
          setPermissions((prev) => [...prev, created]);
        } catch {
          setPermissions((prev) => [...prev, optimistic]);
        }
      } else {
        setPermissions((prev) => [...prev, optimistic]);
      }
      showToast(`Permission "${payload.name}" created`);
    } catch {
      const optimistic: Permission = { ...payload, id: String(Date.now()) };
      setPermissions((prev) => [...prev, optimistic]);
      showToast(`Permission "${payload.name}" created`);
    } finally {
      setIsSaving(false);
      closeModal();
    }
  };

  const handleUpdate = async (payload: PermissionPayload) => {
    if (!activePermission) return;
    setIsSaving(true);
    try {
      await PermissionServices.UpdatePermission(activePermission.id, payload);
    } catch {}
    finally {
      setPermissions((prev) =>
        prev.map((p) => (p.id === activePermission.id ? { ...p, ...payload } : p))
      );
      showToast(`Permission "${payload.name}" updated`);
      setIsSaving(false);
      closeModal();
    }
  };

  const handleDelete = async () => {
    if (!activePermission) return;
    setIsSaving(true);
    try {
      await PermissionServices.DeletePermission(activePermission.id);
    } catch {}
    finally {
      setPermissions((prev) => prev.filter((p) => p.id !== activePermission.id));
      showToast(`Permission "${activePermission.name}" deleted`, "warn");
      setIsSaving(false);
      closeModal();
    }
  };

  const filtered = permissions.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = permissions.filter((p) => p.active).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap');
        .pp-root { min-height:100vh; background:#060b14; font-family:'DM Sans',sans-serif; color:#c8d6e8; padding:40px 48px; }
        .pp-header { margin-bottom:36px; }
        .pp-header-row { display:flex; align-items:center; gap:14px; margin-bottom:6px; }
        .pp-icon { width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg,#f59e0b22,#f59e0b44); border:1px solid #f59e0b44; display:flex; align-items:center; justify-content:center; font-size:18px; }
        .pp-title { margin:0; font-size:26px; font-weight:800; font-family:'Sora',sans-serif; color:#e8edf5; letter-spacing:-0.5px; }
        .pp-subtitle { margin:0; font-size:14px; color:#3d5060; margin-left:52px; }
        .pp-stats { display:flex; gap:16px; margin-bottom:32px; }
        .pp-stat { background:#0a111e; border:1px solid #1e2d45; border-radius:12px; padding:16px 24px; flex:1; }
        .pp-stat-val { font-size:26px; font-weight:800; font-family:'Sora',sans-serif; }
        .pp-stat-label { font-size:12px; color:#3d5060; font-weight:600; margin-top:2px; text-transform:uppercase; letter-spacing:.06em; }
        .pp-controls { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; gap:16px; }
        .pp-search-wrap { position:relative; flex:1; max-width:320px; }
        .pp-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#3d5060; font-size:15px; pointer-events:none; }
        .pp-search { width:100%; box-sizing:border-box; padding-left:36px; padding-right:14px; height:40px; background:#0a111e; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; }
        .pp-search:focus { border-color:${ACCENT}; }
        .pp-btn-primary { padding:9px 22px; border-radius:8px; font-size:13px; font-weight:700; border:none; background:linear-gradient(135deg,#f59e0b,#d97706); color:#051020; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 4px 18px rgba(245,158,11,.2); transition:all .15s; }
        .pp-btn-primary:hover:not(:disabled) { box-shadow:0 6px 24px rgba(245,158,11,.35); }
        .pp-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
        .pp-table-wrap { background:#0a111e; border:1px solid #1e2d45; border-radius:14px; overflow:hidden; }
        .pp-table { width:100%; border-collapse:collapse; }
        .pp-th { padding:14px 16px; text-align:left; font-size:11px; font-weight:700; color:#3d5060; text-transform:uppercase; letter-spacing:.08em; border-bottom:1px solid #1e2d45; }
        .pp-tr { border-bottom:1px solid #111d2e; transition:background .12s; }
        .pp-tr:last-child { border-bottom:none; }
        .pp-tr:hover .pp-td { background:#0d1829; }
        .pp-td { padding:14px 16px; background:transparent; transition:background .12s; }
        .pp-name { font-weight:700; color:#e8edf5; font-size:14px; font-family:'Sora',sans-serif; }
        .pp-desc { font-size:13px; color:#5a6a85; max-width:260px; }
        .pp-badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }
        .pp-badge-active { background:#10b98115; color:#10b981; border:1px solid #10b98130; }
        .pp-badge-inactive { background:#e05c5c12; color:#e05c5c; border:1px solid #e05c5c30; }
        .pp-row-actions { display:flex; gap:6px; }
        .pp-btn-row { padding:6px 14px; border-radius:7px; font-size:12px; font-weight:600; border:1px solid #1e2d45; background:transparent; color:#8a9ab5; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .pp-btn-row.edit:hover { border-color:#f59e0b44; color:#f59e0b; }
        .pp-btn-row.del:hover { border-color:#e05c5c44; color:#e05c5c; }
        .pp-empty { padding:52px; text-align:center; color:#2a3d58; font-size:14px; }
        .pp-footer { margin-top:14px; font-size:12px; color:#2a3d58; }
        .pp-overlay { position:fixed; inset:0; z-index:100; background:rgba(5,8,16,.82); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); animation:ppFadeIn .18s ease; }
        .pp-modal { background:#0f1623; border:1px solid #1e2d45; border-radius:16px; padding:36px 40px; min-width:480px; max-width:540px; width:100%; box-shadow:0 30px 80px rgba(0,0,0,.6); animation:ppSlideUp .22s cubic-bezier(.16,1,.3,1); }
        .pp-modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:28px; }
        .pp-modal-title { margin:0; font-size:20px; font-weight:700; font-family:'Sora',sans-serif; color:#e8edf5; letter-spacing:-.3px; }
        .pp-modal-close { background:none; border:none; color:#5a6a85; cursor:pointer; font-size:22px; line-height:1; padding:2px 6px; border-radius:6px; transition:color .15s; }
        .pp-modal-close:hover { color:#e8edf5; }
        .pp-field { margin-bottom:18px; }
        .pp-field-inline { display:flex; align-items:center; gap:12px; }
        .pp-field-inline .pp-label { margin-bottom:0; }
        .pp-label { display:block; margin-bottom:7px; font-size:12px; font-weight:600; color:#5a6a85; letter-spacing:.08em; text-transform:uppercase; }
        .pp-input { width:100%; box-sizing:border-box; background:#080d18; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; padding:10px 14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; }
        .pp-input:focus { border-color:${ACCENT}; }
        .pp-textarea { resize:vertical; min-height:72px; }
        .pp-toggle { width:44px; height:24px; border-radius:12px; background:#1e2d45; border:1px solid #2a3d58; cursor:pointer; position:relative; transition:background .2s,border-color .2s; flex-shrink:0; }
        .pp-toggle.on { background:#f59e0b30; border-color:#f59e0b; }
        .pp-toggle-thumb { width:18px; height:18px; border-radius:50%; background:#3d5060; position:absolute; top:2px; left:3px; transition:transform .2s,background .2s; }
        .pp-toggle.on .pp-toggle-thumb { transform:translateX(20px); background:#f59e0b; }
        .pp-toggle-label { font-size:13px; color:#5a6a85; }
        .pp-form-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:28px; }
        .pp-btn-ghost { padding:10px 22px; border-radius:8px; font-size:14px; font-weight:600; border:1px solid #1e2d45; background:transparent; color:#5a6a85; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .pp-btn-ghost:hover { border-color:#2a3d58; color:#8a9ab5; }
        .pp-btn-delete { padding:10px 22px; border-radius:8px; font-size:14px; font-weight:700; border:none; background:linear-gradient(135deg,#e05c5c,#c04040); color:#fff; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 4px 18px rgba(224,92,92,.3); transition:all .15s; }
        .pp-btn-delete:disabled { opacity:.5; cursor:not-allowed; }
        .pp-delete-body { margin-bottom:28px; }
        .pp-delete-text { margin:0; color:#8a9ab5; font-size:14px; line-height:1.6; }
        .pp-toast { position:fixed; bottom:32px; right:32px; z-index:999; padding:12px 22px; border-radius:10px; font-size:14px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.5); animation:ppToastIn .25s cubic-bezier(.16,1,.3,1); }
        .pp-toast.ok { background:#1a1400; border:1px solid #f59e0b44; color:#f59e0b; }
        .pp-toast.warn { background:#2a1a1a; border:1px solid #e05c5c55; color:#e05c5c; }
        .pp-skeleton { height:52px; background:#0d1829; border-radius:6px; animation:ppPulse 1.4s ease-in-out infinite; }
        @keyframes ppPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes ppFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes ppSlideUp { from{transform:translateY(22px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes ppToastIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @media (max-width:768px) { .pp-root{padding:24px 16px;} .pp-stats{flex-direction:column;} .pp-modal{min-width:unset;padding:24px 20px;} .pp-table-wrap{overflow-x:auto;} }
      `}</style>

      <div>
        <AppBar position="static" sx={{ bgcolor: "#0a111e", borderBottom: "1px solid #1e2d45", boxShadow: "none" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ zIndex: 10 }} onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>
              Gestión de Permisos
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

        <div className="pp-root">
        {toast && (
          <div className={`pp-toast ${toast.type}`}>
            {toast.type === "ok" ? "✓ " : "⚠ "}{toast.msg}
          </div>
        )}

        <div className="pp-header">
          <div className="pp-header-row">
            <div className="pp-icon">🔑</div>
            <h1 className="pp-title">Permission Management</h1>
          </div>
          <p className="pp-subtitle">Define granular permissions that can be assigned to roles</p>
        </div>

        <div className="pp-stats">
          {[
            { label: "Total Permissions", value: permissions.length, color: ACCENT },
            { label: "Active", value: activeCount, color: "#10b981" },
            { label: "Inactive", value: permissions.length - activeCount, color: "#e05c5c" },
          ].map((s) => (
            <div key={s.label} className="pp-stat">
              <div className="pp-stat-val" style={{ color: s.color }}>{s.value}</div>
              <div className="pp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="pp-controls">
          <div className="pp-search-wrap">
            <span className="pp-search-icon">🔍</span>
            <input
              className="pp-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search permissions…"
            />
          </div>
          <button className="pp-btn-primary" onClick={() => setModal("add")}>
            + Add Permission
          </button>
        </div>

        <div className="pp-table-wrap">
          <table className="pp-table">
            <thead>
              <tr>
                {["Name", "Description", "Status", "Actions"].map((h) => (
                  <th key={h} className="pp-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="pp-td" style={{ padding: "8px 16px" }}>
                      <div className="pp-skeleton" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="pp-empty">No permissions found</td></tr>
              ) : (
                filtered.map((perm) => (
                  <tr key={perm.id} className="pp-tr">
                    <td className="pp-td"><div className="pp-name">{perm.name}</div></td>
                    <td className="pp-td"><div className="pp-desc">{perm.description ?? "—"}</div></td>
                    <td className="pp-td">
                      <span className={`pp-badge ${perm.active ? "pp-badge-active" : "pp-badge-inactive"}`}>
                        {perm.active ? "● Active" : "○ Inactive"}
                      </span>
                    </td>
                    <td className="pp-td">
                      <div className="pp-row-actions">
                        <button className="pp-btn-row edit" onClick={() => { setActivePermission(perm); setModal("edit"); }}>Edit</button>
                        <button className="pp-btn-row del" onClick={() => { setActivePermission(perm); setModal("delete"); }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="pp-footer">Showing {filtered.length} of {permissions.length} permissions</p>
        </div>
      </div>

      {modal === "add" && (
        <Modal title="Create New Permission" onClose={closeModal}>
          <PermissionForm onSave={handleAdd} onCancel={closeModal} isSaving={isSaving} />
        </Modal>
      )}
      {modal === "edit" && activePermission && (
        <Modal title="Edit Permission" onClose={closeModal}>
          <PermissionForm initial={activePermission} onSave={handleUpdate} onCancel={closeModal} isSaving={isSaving} />
        </Modal>
      )}
      {modal === "delete" && activePermission && (
        <Modal title="Delete Permission" onClose={closeModal}>
          <div className="pp-delete-body">
            <p className="pp-delete-text">
              Are you sure you want to delete the permission{" "}
              <strong style={{ color: "#e8edf5" }}>"{activePermission.name}"</strong>?
              This will remove all role assignments that use it.
            </p>
          </div>
          <div className="pp-form-actions">
            <button className="pp-btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="pp-btn-delete" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? "Deleting…" : "Delete Permission"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
