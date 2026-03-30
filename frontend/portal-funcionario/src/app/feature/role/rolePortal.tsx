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
import "./rolePortal.css";

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
    <div className="overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
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
    <div className="form">
      <div className="field">
        <label className="label">Role Name</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Content Manager"
        />
      </div>
      <div className="field">
        <label className="label">Description</label>
        <textarea
          className="input textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this role's purpose..."
          rows={3}
        />
      </div>
      <div className="field">
        <label className="label">Permissions</label>
        <div className="perm-grid">
          {ALL_PERMISSIONS.map((p) => {
            const active = permissions.includes(p);
            const color = PERMISSION_COLORS[p] ?? "#5a6a85";
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePerm(p)}
                className={`perm-btn ${active ? "active" : ""}`}
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
      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className="btn-primary"
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

        <div className="root">
        {/* Toast */}
        {toast && (
          <div className={`toast ${toast.type}`}>
            {toast.type === "ok" ? "✓ " : "⚠ "}
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="header">
          <div className="header-row">
            <div className="icon">🛡️</div>
            <h1 className="title">Role Administration</h1>
          </div>
          <p className="subtitle">
            Manage access control roles and permissions across your organization
          </p>
        </div>

        {/* Stats */}
        <div className="stats">
          {[
            { label: "Total Roles", value: roles.length, color: "#3ecfcf" },
            { label: "Total Users", value: roles.reduce((a, r) => a + (r.usersCount ?? 0), 0), color: "#a78bfa" },
            { label: "Permissions Defined", value: ALL_PERMISSIONS.length, color: "#f0a500" },
          ].map((s) => (
            <div key={s.label} className="stat">
              <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles…"
            />
          </div>
          <div className="actions">
            {selectedRows.length > 0 && (
              <button className="btn-danger" onClick={handleBulkDelete}>
                🗑 Delete {selectedRows.length} selected
              </button>
            )}
            <button className="btn-primary" onClick={() => setModal("add")}>
              + Add Role
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th className="th" style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                {["Role Name", "Description", "Permissions", "Users", "Created", "Actions"].map((h) => (
                  <th key={h} className="th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="td" style={{ padding: "8px 16px" }}>
                      <div className="skeleton" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty">No roles found</td>
                </tr>
              ) : (
                filtered.map((role) => (
                  <tr key={role.id} className="tr">
                    <td className="td">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(role.id)}
                        onChange={() => toggleRow(role.id)}
                      />
                    </td>
                    <td className="td">
                      <div className="role-name">{role.name}</div>
                    </td>
                    <td className="td">
                      <div className="role-desc">{role.description}</div>
                    </td>
                    <td className="td">
                      <div className="perms">
                        {role?.permissions?.map((p) => {
                          const color = PERMISSION_COLORS[p] ?? "#5a6a85";
                          return (
                            <span
                              key={p}
                              className="perm-tag"
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
                    <td className="td">
                      <span className="user-badge">👤 {role.usersCount ?? 0}</span>
                    </td>
                    <td className="td">
                      <span className="date">{role.createdAt}</span>
                    </td>
                    <td className="td">
                      <div className="row-actions">
                        <button
                          className="btn-row edit"
                          onClick={() => { setActiveRole(role); setModal("edit"); }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-row del"
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

        <p className="footer">Showing {filtered.length} of {roles.length} roles</p>
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
          <div className="delete-body">
            <p className="delete-text">
              Are you sure you want to delete the role{" "}
              <strong style={{ color: "#e8edf5" }}>"{activeRole.name}"</strong>?
            </p>
            {(activeRole.usersCount ?? 0) > 0 && (
              <div className="delete-warn">
                ⚠ This role is assigned to{" "}
                <strong>{activeRole.usersCount} user(s)</strong>. Deleting it may affect their access.
              </div>
            )}
          </div>
          <div className="form-actions">
            <button className="btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="btn-delete" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? "Deleting…" : "Delete Role"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
