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
import "./permissionPortal.css";

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
