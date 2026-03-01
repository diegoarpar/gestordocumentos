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
import RoleService from "@/app/api/userServices";

const ALL_PERMISSIONS = [
  "read",
  "write",
  "delete",
  "manage_users",
  "moderate",
  "export",
  "configure",
];

const PERMISSION_COLORS: Record<string, string> = {
  read: "#3ecfcf",
  write: "#f0a500",
  delete: "#e05c5c",
  manage_users: "#a78bfa",
  moderate: "#60d394",
  export: "#f9a8d4",
  configure: "#93c5fd",
};


const SEED_ROLES: Role[] = [
  { id: 1, name: "Super Admin", description: "Full system access", permissions: ["read", "write", "delete", "manage_users"], usersCount: 2, createdAt: "2024-01-10" },
  { id: 2, name: "Admin", description: "Administrative access without user management", permissions: ["read", "write", "delete"], usersCount: 5, createdAt: "2024-01-12" },
  { id: 3, name: "Editor", description: "Can create and edit content", permissions: ["read", "write"], usersCount: 14, createdAt: "2024-02-03" },
  { id: 4, name: "Viewer", description: "Read-only access to the platform", permissions: ["read"], usersCount: 38, createdAt: "2024-02-15" },
  { id: 5, name: "Moderator", description: "Content moderation and user flagging", permissions: ["read", "write", "moderate"], usersCount: 7, createdAt: "2024-03-01" },
];


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
    <div className="rp-overlay">
      <div className="rp-modal">
        <div className="rp-modal-header">
          <h2 className="rp-modal-title">{title}</h2>
          <button className="rp-modal-close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function RoleForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial?: Role;
  onSave: (data: CreateRolePayload) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [permissions, setPermissions] = useState<string[]>(initial?.permissions ?? []);

  const togglePerm = (p: string) =>
    setPermissions((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );

  const valid = name.trim().length > 0;

  return (
    <div className="rp-form">
      <div className="rp-field">
        <label className="rp-label">Role Name</label>
        <input
          className="rp-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Content Manager"
        />
      </div>
      <div className="rp-field">
        <label className="rp-label">Description</label>
        <textarea
          className="rp-input rp-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this role's purpose..."
          rows={3}
        />
      </div>
      <div className="rp-field">
        <label className="rp-label">Permissions</label>
        <div className="rp-perm-grid">
          {ALL_PERMISSIONS.map((p) => {
            const active = permissions.includes(p);
            const color = PERMISSION_COLORS[p] ?? "#5a6a85";
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePerm(p)}
                className={`rp-perm-btn ${active ? "active" : ""}`}
                style={{
                  borderColor: active ? color : undefined,
                  backgroundColor: active ? `${color}18` : undefined,
                  color: active ? color : undefined,
                }}
              >
                {active ? "✓ " : ""}
                {p.replace("_", " ")}
              </button>
            );
          })}
        </div>
      </div>
      <div className="rp-form-actions">
        <button type="button" className="rp-btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className="rp-btn-primary"
          disabled={!valid || isSaving}
          onClick={() => valid && onSave({ name: name.trim(), description: description.trim(), permissions })}
        >
          {isSaving ? "Saving…" : initial ? "Save Changes" : "Create Role"}
        </button>
      </div>
    </div>
  );
}


export default function RolePortal() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<(number | string)[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "warn" | "err" } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    RoleService.GetRolesProcess()
      .then((res) => res.json())
      .then((data) => {
        console.log(data.roles);
        setRoles(Array.isArray(data.roles) ? data.roles : SEED_ROLES);
      })
      .catch(() => {
        // Fallback to seed data if API is unavailable
        setRoles(SEED_ROLES);
      })
      .finally(() => setLoading(false));
  }, []);


  const showToast = (msg: string, type: "ok" | "warn" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeModal = () => {
    setModal(null);
    setActiveRole(null);
  };

  const handleAdd = async (payload: CreateRolePayload) => {
    setIsSaving(true);
    try {
      var servicePayload = {"name": payload.name};
      const res = await RoleService.CreateRolesProcess(servicePayload);
      if (res.ok) {
        const created: Role = await res.json();
        setRoles((prev) => [...prev, created]);
        showToast(`Role "${created.name}" created`);
      } else {
        const optimistic: Role = { ...payload, id: Date.now(), usersCount: 0, createdAt: new Date().toISOString().split("T")[0] };
        setRoles((prev) => [...prev, optimistic]);
        showToast(`Role "${payload.name}" created`);
      }
    } catch (exception) {
      console.log(exception);
      const optimistic: Role = { ...payload, id: Date.now(), usersCount: 0, createdAt: new Date().toISOString().split("T")[0] };
      setRoles((prev) => [...prev, optimistic]);
      showToast(`Role "${payload.name}" created`);
    } finally {
      setIsSaving(false);
      closeModal();
    }
  };

  const handleUpdate = async (payload: CreateRolePayload) => {
    if (!activeRole) return;
    setIsSaving(true);
    try {
      const res = await RoleService.GetRolesProcess(activeRole.id);
      if (res.ok) {
        const updated: Role = await res.json();
        setRoles((prev) => prev.map((r) => (r.id === activeRole.id ? updated : r)));
      } else {
        setRoles((prev) => prev.map((r) => (r.id === activeRole.id ? { ...r, ...payload } : r)));
      }
      showToast(`Role "${payload.name}" updated`);
    } catch {
      setRoles((prev) => prev.map((r) => (r.id === activeRole.id ? { ...r, ...payload } : r)));
      showToast(`Role "${payload.name}" updated`);
    } finally {
      setIsSaving(false);
      closeModal();
    }
  };

  const handleDelete = async () => {
    if (!activeRole) return;
    setIsSaving(true);
    try {
      await RoleService.DeleteRolesProcess(activeRole.id);
    } catch {

    } finally {
      setRoles((prev) => prev.filter((r) => r.id !== activeRole.id));
      showToast(`Role "${activeRole.name}" deleted`, "warn");
      setIsSaving(false);
      closeModal();
    }
  };

  const handleBulkDelete = async () => {
    const toDelete = roles.filter((r) => selectedRows.includes(r.id));
    await Promise.allSettled(toDelete.map((r) => RoleService.deleteRole(r.id)));
    setRoles((prev) => prev.filter((r) => !selectedRows.includes(r.id)));
    showToast(`${toDelete.length} role(s) deleted`, "warn");
    setSelectedRows([]);
  };

  
  const filtered = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRow = (id: number | string) =>
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleAll = () =>
    setSelectedRows((prev) =>
      prev.length === filtered.length ? [] : filtered.map((r) => r.id)
    );


  return (
    <>
      {/* ── Scoped CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap');

        .rp-root {
          min-height: 100vh;
          background: #060b14;
          font-family: 'DM Sans', sans-serif;
          color: #c8d6e8;
          padding: 40px 48px;
        }
        /* ── Header ── */
        .rp-header { margin-bottom: 36px; }
        .rp-header-row { display: flex; align-items: center; gap: 14px; margin-bottom: 6px; }
        .rp-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg,#3ecfcf22,#3ecfcf44);
          border: 1px solid #3ecfcf44;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .rp-title {
          margin: 0; font-size: 26px; font-weight: 800;
          font-family: 'Sora', sans-serif; color: #e8edf5; letter-spacing: -0.5px;
        }
        .rp-subtitle { margin: 0; font-size: 14px; color: #3d5060; margin-left: 52px; }
        /* ── Stats ── */
        .rp-stats { display: flex; gap: 16px; margin-bottom: 32px; }
        .rp-stat {
          background: #0a111e; border: 1px solid #1e2d45; border-radius: 12px;
          padding: 16px 24px; flex: 1;
        }
        .rp-stat-val { font-size: 26px; font-weight: 800; font-family: 'Sora', sans-serif; }
        .rp-stat-label { font-size: 12px; color: #3d5060; font-weight: 600; margin-top: 2px; text-transform: uppercase; letter-spacing: .06em; }
        /* ── Controls ── */
        .rp-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 16px; }
        .rp-search-wrap { position: relative; flex: 1; max-width: 320px; }
        .rp-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #3d5060; font-size: 15px; pointer-events: none; }
        .rp-search {
          width: 100%; box-sizing: border-box; padding-left: 36px; padding-right: 14px;
          height: 40px; background: #0a111e; border: 1px solid #1e2d45; border-radius: 8px;
          color: #c8d6e8; font-size: 14px; outline: none; font-family: 'DM Sans', sans-serif;
          transition: border-color .15s;
        }
        .rp-search:focus { border-color: #3ecfcf; }
        .rp-actions { display: flex; gap: 10px; }
        .rp-btn-danger {
          padding: 9px 18px; border-radius: 8px; font-size: 13px; font-weight: 600;
          border: 1px solid #e05c5c44; background: #e05c5c18; color: #e05c5c;
          cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
        }
        .rp-btn-danger:hover { background: #e05c5c28; border-color: #e05c5c88; }
        .rp-btn-primary {
          padding: 9px 22px; border-radius: 8px; font-size: 13px; font-weight: 700;
          border: none; background: linear-gradient(135deg,#3ecfcf,#2aa8a8);
          color: #051020; cursor: pointer; font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 18px rgba(62,207,207,.2); transition: all .15s;
        }
        .rp-btn-primary:hover:not(:disabled) { box-shadow: 0 6px 24px rgba(62,207,207,.35); }
        .rp-btn-primary:disabled { opacity: .5; cursor: not-allowed; }
        /* ── Table ── */
        .rp-table-wrap { background: #0a111e; border: 1px solid #1e2d45; border-radius: 14px; overflow: hidden; }
        .rp-table { width: 100%; border-collapse: collapse; }
        .rp-th {
          padding: 14px 16px; text-align: left;
          font-size: 11px; font-weight: 700; color: #3d5060;
          text-transform: uppercase; letter-spacing: .08em;
          border-bottom: 1px solid #1e2d45;
        }
        .rp-tr { border-bottom: 1px solid #111d2e; transition: background .12s; }
        .rp-tr:last-child { border-bottom: none; }
        .rp-tr:hover .rp-td { background: #0d1829; }
        .rp-td { padding: 14px 16px; background: transparent; transition: background .12s; }
        .rp-role-name { font-weight: 700; color: #e8edf5; font-size: 14px; font-family: 'Sora', sans-serif; }
        .rp-role-desc { font-size: 13px; color: #5a6a85; max-width: 220px; }
        .rp-perms { display: flex; flex-wrap: wrap; gap: 5px; }
        .rp-perm-tag {
          padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
          letter-spacing: .02em;
        }
        .rp-user-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: #1e2d45; border-radius: 20px; padding: 3px 12px;
          font-size: 12px; font-weight: 600; color: #8a9ab5;
        }
        .rp-date { font-size: 12px; color: #3d5060; }
        .rp-row-actions { display: flex; gap: 6px; }
        .rp-btn-row {
          padding: 6px 14px; border-radius: 7px; font-size: 12px; font-weight: 600;
          border: 1px solid #1e2d45; background: transparent; color: #8a9ab5;
          cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
        }
        .rp-btn-row.edit:hover { border-color: #3ecfcf44; color: #3ecfcf; }
        .rp-btn-row.del:hover { border-color: #e05c5c44; color: #e05c5c; }
        .rp-empty { padding: 52px; text-align: center; color: #2a3d58; font-size: 14px; }
        .rp-footer { margin-top: 14px; font-size: 12px; color: #2a3d58; }
        /* ── Modal ── */
        .rp-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(5,8,16,.82);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(4px);
          animation: rpFadeIn .18s ease;
        }
        .rp-modal {
          background: #0f1623; border: 1px solid #1e2d45; border-radius: 16px;
          padding: 36px 40px; min-width: 480px; max-width: 560px; width: 100%;
          box-shadow: 0 30px 80px rgba(0,0,0,.6);
          animation: rpSlideUp .22s cubic-bezier(.16,1,.3,1);
        }
        .rp-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
        .rp-modal-title { margin: 0; font-size: 20px; font-weight: 700; font-family: 'Sora', sans-serif; color: #e8edf5; letter-spacing: -.3px; }
        .rp-modal-close {
          background: none; border: none; color: #5a6a85; cursor: pointer;
          font-size: 22px; line-height: 1; padding: 2px 6px; border-radius: 6px; transition: color .15s;
        }
        .rp-modal-close:hover { color: #e8edf5; }
        /* ── Form ── */
        .rp-form {}
        .rp-field { margin-bottom: 18px; }
        .rp-label { display: block; margin-bottom: 7px; font-size: 12px; font-weight: 600; color: #5a6a85; letter-spacing: .08em; text-transform: uppercase; }
        .rp-input {
          width: 100%; box-sizing: border-box;
          background: #080d18; border: 1px solid #1e2d45; border-radius: 8px;
          color: #c8d6e8; font-size: 14px; padding: 10px 14px; outline: none;
          font-family: 'DM Sans', sans-serif; transition: border-color .15s;
        }
        .rp-input:focus { border-color: #3ecfcf; }
        .rp-textarea { resize: vertical; min-height: 72px; }
        .rp-perm-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
        .rp-perm-btn {
          padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; border: 1.5px solid #1e2d45;
          background: transparent; color: #3d5060; cursor: pointer; transition: all .15s; letter-spacing: .02em;
        }
        .rp-form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 28px; }
        .rp-btn-ghost {
          padding: 10px 22px; border-radius: 8px; font-size: 14px; font-weight: 600;
          border: 1px solid #1e2d45; background: transparent; color: #5a6a85;
          cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
        }
        .rp-btn-ghost:hover { border-color: #2a3d58; color: #8a9ab5; }
        /* ── Delete confirm ── */
        .rp-delete-body { margin-bottom: 28px; }
        .rp-delete-text { margin: 0 0 12px; color: #8a9ab5; font-size: 14px; line-height: 1.6; }
        .rp-delete-warn {
          padding: 12px 16px; border-radius: 8px;
          background: #e05c5c12; border: 1px solid #e05c5c33; color: #e05c5c; font-size: 13px;
        }
        .rp-btn-delete {
          padding: 10px 22px; border-radius: 8px; font-size: 14px; font-weight: 700;
          border: none; background: linear-gradient(135deg,#e05c5c,#c04040);
          color: #fff; cursor: pointer; font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 18px rgba(224,92,92,.3); transition: all .15s;
        }
        .rp-btn-delete:disabled { opacity: .5; cursor: not-allowed; }
        /* ── Toast ── */
        .rp-toast {
          position: fixed; bottom: 32px; right: 32px; z-index: 999;
          padding: 12px 22px; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          box-shadow: 0 8px 32px rgba(0,0,0,.5);
          animation: rpToastIn .25s cubic-bezier(.16,1,.3,1);
        }
        .rp-toast.ok { background: #0d1f1f; border: 1px solid #3ecfcf44; color: #3ecfcf; }
        .rp-toast.warn { background: #2a1a1a; border: 1px solid #e05c5c55; color: #e05c5c; }
        .rp-toast.err { background: #2a1a1a; border: 1px solid #e05c5c55; color: #e05c5c; }
        /* ── Loading skeleton ── */
        .rp-skeleton { height: 52px; background: #0d1829; border-radius: 6px; animation: rpPulse 1.4s ease-in-out infinite; }
        @keyframes rpPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes rpFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes rpSlideUp { from{transform:translateY(22px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes rpToastIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        input[type=checkbox] { accent-color: #3ecfcf; cursor: pointer; }
        @media (max-width: 768px) {
          .rp-root { padding: 24px 16px; }
          .rp-stats { flex-direction: column; }
          .rp-modal { min-width: unset; padding: 24px 20px; }
          .rp-table-wrap { overflow-x: auto; }
        }
      `}</style>

      <div>
        <AppBar position="static" sx={{ bgcolor: "#0a111e", borderBottom: "1px solid #1e2d45", boxShadow: "none" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ zIndex: 10 }} onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>
              Administración de Roles
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

        <div className="rp-root">
        {/* Toast */}
        {toast && (
          <div className={`rp-toast ${toast.type}`}>
            {toast.type === "ok" ? "✓ " : "⚠ "}
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="rp-header">
          <div className="rp-header-row">
            <div className="rp-icon">🛡️</div>
            <h1 className="rp-title">Role Administration</h1>
          </div>
          <p className="rp-subtitle">
            Manage access control roles and permissions across your organization
          </p>
        </div>

        {/* Stats */}
        <div className="rp-stats">
          {[
            { label: "Total Roles", value: roles.length, color: "#3ecfcf" },
            { label: "Total Users", value: roles.reduce((a, r) => a + (r.usersCount ?? 0), 0), color: "#a78bfa" },
            { label: "Permissions Defined", value: ALL_PERMISSIONS.length, color: "#f0a500" },
          ].map((s) => (
            <div key={s.label} className="rp-stat">
              <div className="rp-stat-val" style={{ color: s.color }}>{s.value}</div>
              <div className="rp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="rp-controls">
          <div className="rp-search-wrap">
            <span className="rp-search-icon">🔍</span>
            <input
              className="rp-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles…"
            />
          </div>
          <div className="rp-actions">
            {selectedRows.length > 0 && (
              <button className="rp-btn-danger" onClick={handleBulkDelete}>
                🗑 Delete {selectedRows.length} selected
              </button>
            )}
            <button className="rp-btn-primary" onClick={() => setModal("add")}>
              + Add Role
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rp-table-wrap">
          <table className="rp-table">
            <thead>
              <tr>
                <th className="rp-th" style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                {["Role Name", "Description", "Permissions", "Users", "Created", "Actions"].map((h) => (
                  <th key={h} className="rp-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="rp-td" style={{ padding: "8px 16px" }}>
                      <div className="rp-skeleton" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="rp-empty">No roles found</td>
                </tr>
              ) : (
                filtered.map((role) => (
                  <tr key={role.id} className="rp-tr">
                    <td className="rp-td">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(role.id)}
                        onChange={() => toggleRow(role.id)}
                      />
                    </td>
                    <td className="rp-td">
                      <div className="rp-role-name">{role.name}</div>
                    </td>
                    <td className="rp-td">
                      <div className="rp-role-desc">{role.description}</div>
                    </td>
                    <td className="rp-td">
                      <div className="rp-perms">
                        {role?.permissions?.map((p) => {
                          const color = PERMISSION_COLORS[p] ?? "#5a6a85";
                          return (
                            <span
                              key={p}
                              className="rp-perm-tag"
                              style={{
                                background: `${color}15`,
                                color,
                                border: `1px solid ${color}30`,
                              }}
                            >
                              {p.replace("_", " ")}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="rp-td">
                      <span className="rp-user-badge">👤 {role.usersCount ?? 0}</span>
                    </td>
                    <td className="rp-td">
                      <span className="rp-date">{role.createdAt}</span>
                    </td>
                    <td className="rp-td">
                      <div className="rp-row-actions">
                        <button
                          className="rp-btn-row edit"
                          onClick={() => { setActiveRole(role); setModal("edit"); }}
                        >
                          Edit
                        </button>
                        <button
                          className="rp-btn-row del"
                          onClick={() => { setActiveRole(role); setModal("delete"); }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="rp-footer">Showing {filtered.length} of {roles.length} roles</p>
        </div>
      </div>

      {/* ── Add Modal ── */}
      {modal === "add" && (
        <Modal title="Create New Role" onClose={closeModal}>
          <RoleForm onSave={handleAdd} onCancel={closeModal} isSaving={isSaving} />
        </Modal>
      )}

      {/* ── Edit Modal ── */}
      {modal === "edit" && activeRole && (
        <Modal title="Edit Role" onClose={closeModal}>
          <RoleForm initial={activeRole} onSave={handleUpdate} onCancel={closeModal} isSaving={isSaving} />
        </Modal>
      )}

      {/* ── Delete Modal ── */}
      {modal === "delete" && activeRole && (
        <Modal title="Delete Role" onClose={closeModal}>
          <div className="rp-delete-body">
            <p className="rp-delete-text">
              Are you sure you want to delete the role{" "}
              <strong style={{ color: "#e8edf5" }}>"{activeRole.name}"</strong>?
            </p>
            {(activeRole.usersCount ?? 0) > 0 && (
              <div className="rp-delete-warn">
                ⚠ This role is assigned to{" "}
                <strong>{activeRole.usersCount} user(s)</strong>. Deleting it may affect their access.
              </div>
            )}
          </div>
          <div className="rp-form-actions">
            <button className="rp-btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="rp-btn-delete" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? "Deleting…" : "Delete Role"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
