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
import GroupServices from "@/app/api/permissionsManagementServices";
import "./groupPortal.css";

type Group = {
  id: string;
  name: string;
  description?: string;
  active: boolean;
};

type GroupPayload = {
  name: string;
  description: string;
  active: boolean;
};

const SEED_GROUPS: Group[] = [
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

function GroupForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial?: Group;
  onSave: (data: GroupPayload) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [active, setActive] = useState(initial?.active ?? true);
  const valid = name.trim().length > 0;

  return (
    <div className="form">
      <div className="field">
        <label className="label">Group Name</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Operations Team"
        />
      </div>
      <div className="field">
        <label className="label">Description</label>
        <textarea
          className="input textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this group's purpose..."
          rows={3}
        />
      </div>
      <div className="field field-inline">
        <label className="label">Active</label>
        <div
          className={`toggle ${active ? "on" : ""}`}
          onClick={() => setActive((v) => !v)}
          role="switch"
          aria-checked={active}
        >
          <div className="toggle-thumb" />
        </div>
        <span className="toggle-label">{active ? "Active" : "Inactive"}</span>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button
          type="button"
          className="btn-primary"
          disabled={!valid || isSaving}
          onClick={() => valid && onSave({ name: name.trim(), description: description.trim(), active })}
        >
          {isSaving ? "Saving…" : initial ? "Save Changes" : "Create Group"}
        </button>
      </div>
    </div>
  );
}

export default function GroupPortal() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "warn" | "err" } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    GroupServices.GetGroups()
      .then((res) => res.json())
      .then((data) => {
        setGroups(Array.isArray(data.groups) ? data.groups : SEED_GROUPS);
      })
      .catch(() => setGroups(SEED_GROUPS))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string, type: "ok" | "warn" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeModal = () => {
    setModal(null);
    setActiveGroup(null);
  };

  const handleAdd = async (payload: GroupPayload) => {
    setIsSaving(true);
    try {
      const res = await GroupServices.CreateGroup(payload);
      const optimistic: Group = { ...payload, id: String(Date.now()) };
      if (res.ok) {
        try {
          const created: Group = await res.json();
          setGroups((prev) => [...prev, created]);
        } catch {
          setGroups((prev) => [...prev, optimistic]);
        }
      } else {
        setGroups((prev) => [...prev, optimistic]);
      }
      showToast(`Group "${payload.name}" created`);
    } catch {
      const optimistic: Group = { ...payload, id: String(Date.now()) };
      setGroups((prev) => [...prev, optimistic]);
      showToast(`Group "${payload.name}" created`);
    } finally {
      setIsSaving(false);
      closeModal();
    }
  };

  const handleUpdate = async (payload: GroupPayload) => {
    if (!activeGroup) return;
    setIsSaving(true);
    try {
      await GroupServices.UpdateGroup(activeGroup.id, payload);
      setGroups((prev) =>
        prev.map((g) => (g.id === activeGroup.id ? { ...g, ...payload } : g))
      );
      showToast(`Group "${payload.name}" updated`);
    } catch {
      setGroups((prev) =>
        prev.map((g) => (g.id === activeGroup.id ? { ...g, ...payload } : g))
      );
      showToast(`Group "${payload.name}" updated`);
    } finally {
      setIsSaving(false);
      closeModal();
    }
  };

  const handleDelete = async () => {
    if (!activeGroup) return;
    setIsSaving(true);
    try {
      await GroupServices.DeleteGroup(activeGroup.id);
    } catch {}
    finally {
      setGroups((prev) => prev.filter((g) => g.id !== activeGroup.id));
      showToast(`Group "${activeGroup.name}" deleted`, "warn");
      setIsSaving(false);
      closeModal();
    }
  };

  const filtered = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = groups.filter((g) => g.active).length;

  return (
    <>
      <div>
        <AppBar position="static" sx={{ bgcolor: "#0a111e", borderBottom: "1px solid #1e2d45", boxShadow: "none" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ zIndex: 10 }} onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>
              Gestión de Grupos
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
        {toast && (
          <div className={`toast ${toast.type}`}>
            {toast.type === "ok" ? "✓ " : "⚠ "}{toast.msg}
          </div>
        )}

        <div className="header">
          <div className="header-row">
            <div className="icon">👥</div>
            <h1 className="title">Group Management</h1>
          </div>
          <p className="subtitle">Organize users into groups for access control</p>
        </div>

        <div className="stats">
          {[
            { label: "Total Groups", value: groups.length, color: ACCENT },
            { label: "Active", value: activeCount, color: "#10b981" },
            { label: "Inactive", value: groups.length - activeCount, color: "#e05c5c" },
          ].map((s) => (
            <div key={s.label} className="stat">
              <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
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
              placeholder="Search groups…"
            />
          </div>
          <button className="btn-primary" onClick={() => setModal("add")}>
            + Add Group
          </button>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {["Name", "Description", "Status", "Actions"].map((h) => (
                  <th key={h} className="th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="td" style={{ padding: "8px 16px" }}>
                      <div className="skeleton" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="empty">No groups found</td></tr>
              ) : (
                filtered.map((group) => (
                  <tr key={group.id} className="tr">
                    <td className="td"><div className="name">{group.name}</div></td>
                    <td className="td"><div className="desc">{group.description ?? "—"}</div></td>
                    <td className="td">
                      <span className={`badge ${group.active ? "badge-active" : "badge-inactive"}`}>
                        {group.active ? "● Active" : "○ Inactive"}
                      </span>
                    </td>
                    <td className="td">
                      <div className="row-actions">
                        <button className="btn-row edit" onClick={() => { setActiveGroup(group); setModal("edit"); }}>Edit</button>
                        <button className="btn-row del" onClick={() => { setActiveGroup(group); setModal("delete"); }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="footer">Showing {filtered.length} of {groups.length} groups</p>
        </div>
      </div>

      {modal === "add" && (
        <Modal title="Create New Group" onClose={closeModal}>
          <GroupForm onSave={handleAdd} onCancel={closeModal} isSaving={isSaving} />
        </Modal>
      )}
      {modal === "edit" && activeGroup && (
        <Modal title="Edit Group" onClose={closeModal}>
          <GroupForm initial={activeGroup} onSave={handleUpdate} onCancel={closeModal} isSaving={isSaving} />
        </Modal>
      )}
      {modal === "delete" && activeGroup && (
        <Modal title="Delete Group" onClose={closeModal}>
          <div className="delete-body">
            <p className="delete-text">
              Are you sure you want to delete the group{" "}
              <strong style={{ color: "#e8edf5" }}>"{activeGroup.name}"</strong>?
              This will remove all user memberships associated with it.
            </p>
          </div>
          <div className="form-actions">
            <button className="btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="btn-delete" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? "Deleting…" : "Delete Group"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
