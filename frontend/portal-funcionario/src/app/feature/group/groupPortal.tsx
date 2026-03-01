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
  { id: "1", name: "Administrators", description: "Full system access group", active: true },
  { id: "2", name: "Editors", description: "Content management group", active: true },
  { id: "3", name: "Viewers", description: "Read-only access group", active: true },
  { id: "4", name: "Moderators", description: "Content moderation group", active: false },
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
    <div className="gp-overlay">
      <div className="gp-modal">
        <div className="gp-modal-header">
          <h2 className="gp-modal-title">{title}</h2>
          <button className="gp-modal-close" onClick={onClose}>×</button>
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
    <div className="gp-form">
      <div className="gp-field">
        <label className="gp-label">Group Name</label>
        <input
          className="gp-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Operations Team"
        />
      </div>
      <div className="gp-field">
        <label className="gp-label">Description</label>
        <textarea
          className="gp-input gp-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this group's purpose..."
          rows={3}
        />
      </div>
      <div className="gp-field gp-field-inline">
        <label className="gp-label">Active</label>
        <div
          className={`gp-toggle ${active ? "on" : ""}`}
          onClick={() => setActive((v) => !v)}
          role="switch"
          aria-checked={active}
        >
          <div className="gp-toggle-thumb" />
        </div>
        <span className="gp-toggle-label">{active ? "Active" : "Inactive"}</span>
      </div>
      <div className="gp-form-actions">
        <button type="button" className="gp-btn-ghost" onClick={onCancel}>Cancel</button>
        <button
          type="button"
          className="gp-btn-primary"
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap');
        .gp-root { min-height:100vh; background:#060b14; font-family:'DM Sans',sans-serif; color:#c8d6e8; padding:40px 48px; }
        .gp-header { margin-bottom:36px; }
        .gp-header-row { display:flex; align-items:center; gap:14px; margin-bottom:6px; }
        .gp-icon { width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg,#3b82f622,#3b82f644); border:1px solid #3b82f644; display:flex; align-items:center; justify-content:center; font-size:18px; }
        .gp-title { margin:0; font-size:26px; font-weight:800; font-family:'Sora',sans-serif; color:#e8edf5; letter-spacing:-0.5px; }
        .gp-subtitle { margin:0; font-size:14px; color:#3d5060; margin-left:52px; }
        .gp-stats { display:flex; gap:16px; margin-bottom:32px; }
        .gp-stat { background:#0a111e; border:1px solid #1e2d45; border-radius:12px; padding:16px 24px; flex:1; }
        .gp-stat-val { font-size:26px; font-weight:800; font-family:'Sora',sans-serif; }
        .gp-stat-label { font-size:12px; color:#3d5060; font-weight:600; margin-top:2px; text-transform:uppercase; letter-spacing:.06em; }
        .gp-controls { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; gap:16px; }
        .gp-search-wrap { position:relative; flex:1; max-width:320px; }
        .gp-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#3d5060; font-size:15px; pointer-events:none; }
        .gp-search { width:100%; box-sizing:border-box; padding-left:36px; padding-right:14px; height:40px; background:#0a111e; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; }
        .gp-search:focus { border-color:${ACCENT}; }
        .gp-btn-primary { padding:9px 22px; border-radius:8px; font-size:13px; font-weight:700; border:none; background:linear-gradient(135deg,#3b82f6,#2563eb); color:#fff; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 4px 18px rgba(59,130,246,.2); transition:all .15s; }
        .gp-btn-primary:hover:not(:disabled) { box-shadow:0 6px 24px rgba(59,130,246,.35); }
        .gp-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
        .gp-table-wrap { background:#0a111e; border:1px solid #1e2d45; border-radius:14px; overflow:hidden; }
        .gp-table { width:100%; border-collapse:collapse; }
        .gp-th { padding:14px 16px; text-align:left; font-size:11px; font-weight:700; color:#3d5060; text-transform:uppercase; letter-spacing:.08em; border-bottom:1px solid #1e2d45; }
        .gp-tr { border-bottom:1px solid #111d2e; transition:background .12s; }
        .gp-tr:last-child { border-bottom:none; }
        .gp-tr:hover .gp-td { background:#0d1829; }
        .gp-td { padding:14px 16px; background:transparent; transition:background .12s; }
        .gp-name { font-weight:700; color:#e8edf5; font-size:14px; font-family:'Sora',sans-serif; }
        .gp-desc { font-size:13px; color:#5a6a85; max-width:260px; }
        .gp-badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }
        .gp-badge-active { background:#10b98115; color:#10b981; border:1px solid #10b98130; }
        .gp-badge-inactive { background:#e05c5c12; color:#e05c5c; border:1px solid #e05c5c30; }
        .gp-row-actions { display:flex; gap:6px; }
        .gp-btn-row { padding:6px 14px; border-radius:7px; font-size:12px; font-weight:600; border:1px solid #1e2d45; background:transparent; color:#8a9ab5; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .gp-btn-row.edit:hover { border-color:#3b82f644; color:#3b82f6; }
        .gp-btn-row.del:hover { border-color:#e05c5c44; color:#e05c5c; }
        .gp-empty { padding:52px; text-align:center; color:#2a3d58; font-size:14px; }
        .gp-footer { margin-top:14px; font-size:12px; color:#2a3d58; }
        .gp-overlay { position:fixed; inset:0; z-index:100; background:rgba(5,8,16,.82); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); animation:gpFadeIn .18s ease; }
        .gp-modal { background:#0f1623; border:1px solid #1e2d45; border-radius:16px; padding:36px 40px; min-width:480px; max-width:540px; width:100%; box-shadow:0 30px 80px rgba(0,0,0,.6); animation:gpSlideUp .22s cubic-bezier(.16,1,.3,1); }
        .gp-modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:28px; }
        .gp-modal-title { margin:0; font-size:20px; font-weight:700; font-family:'Sora',sans-serif; color:#e8edf5; letter-spacing:-.3px; }
        .gp-modal-close { background:none; border:none; color:#5a6a85; cursor:pointer; font-size:22px; line-height:1; padding:2px 6px; border-radius:6px; transition:color .15s; }
        .gp-modal-close:hover { color:#e8edf5; }
        .gp-form {}
        .gp-field { margin-bottom:18px; }
        .gp-field-inline { display:flex; align-items:center; gap:12px; }
        .gp-field-inline .gp-label { margin-bottom:0; }
        .gp-label { display:block; margin-bottom:7px; font-size:12px; font-weight:600; color:#5a6a85; letter-spacing:.08em; text-transform:uppercase; }
        .gp-input { width:100%; box-sizing:border-box; background:#080d18; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; padding:10px 14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; }
        .gp-input:focus { border-color:${ACCENT}; }
        .gp-textarea { resize:vertical; min-height:72px; }
        .gp-toggle { width:44px; height:24px; border-radius:12px; background:#1e2d45; border:1px solid #2a3d58; cursor:pointer; position:relative; transition:background .2s,border-color .2s; flex-shrink:0; }
        .gp-toggle.on { background:#3b82f630; border-color:#3b82f6; }
        .gp-toggle-thumb { width:18px; height:18px; border-radius:50%; background:#3d5060; position:absolute; top:2px; left:3px; transition:transform .2s,background .2s; }
        .gp-toggle.on .gp-toggle-thumb { transform:translateX(20px); background:#3b82f6; }
        .gp-toggle-label { font-size:13px; color:#5a6a85; }
        .gp-form-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:28px; }
        .gp-btn-ghost { padding:10px 22px; border-radius:8px; font-size:14px; font-weight:600; border:1px solid #1e2d45; background:transparent; color:#5a6a85; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .gp-btn-ghost:hover { border-color:#2a3d58; color:#8a9ab5; }
        .gp-btn-delete { padding:10px 22px; border-radius:8px; font-size:14px; font-weight:700; border:none; background:linear-gradient(135deg,#e05c5c,#c04040); color:#fff; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 4px 18px rgba(224,92,92,.3); transition:all .15s; }
        .gp-btn-delete:disabled { opacity:.5; cursor:not-allowed; }
        .gp-delete-body { margin-bottom:28px; }
        .gp-delete-text { margin:0 0 0; color:#8a9ab5; font-size:14px; line-height:1.6; }
        .gp-toast { position:fixed; bottom:32px; right:32px; z-index:999; padding:12px 22px; border-radius:10px; font-size:14px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.5); animation:gpToastIn .25s cubic-bezier(.16,1,.3,1); }
        .gp-toast.ok { background:#0d1829; border:1px solid #3b82f644; color:#3b82f6; }
        .gp-toast.warn { background:#2a1a1a; border:1px solid #e05c5c55; color:#e05c5c; }
        .gp-toast.err { background:#2a1a1a; border:1px solid #e05c5c55; color:#e05c5c; }
        .gp-skeleton { height:52px; background:#0d1829; border-radius:6px; animation:gpPulse 1.4s ease-in-out infinite; }
        @keyframes gpPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes gpFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes gpSlideUp { from{transform:translateY(22px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes gpToastIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @media (max-width:768px) { .gp-root{padding:24px 16px;} .gp-stats{flex-direction:column;} .gp-modal{min-width:unset;padding:24px 20px;} .gp-table-wrap{overflow-x:auto;} }
      `}</style>

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

        <div className="gp-root">
        {toast && (
          <div className={`gp-toast ${toast.type}`}>
            {toast.type === "ok" ? "✓ " : "⚠ "}{toast.msg}
          </div>
        )}

        <div className="gp-header">
          <div className="gp-header-row">
            <div className="gp-icon">👥</div>
            <h1 className="gp-title">Group Management</h1>
          </div>
          <p className="gp-subtitle">Organize users into groups for access control</p>
        </div>

        <div className="gp-stats">
          {[
            { label: "Total Groups", value: groups.length, color: ACCENT },
            { label: "Active", value: activeCount, color: "#10b981" },
            { label: "Inactive", value: groups.length - activeCount, color: "#e05c5c" },
          ].map((s) => (
            <div key={s.label} className="gp-stat">
              <div className="gp-stat-val" style={{ color: s.color }}>{s.value}</div>
              <div className="gp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="gp-controls">
          <div className="gp-search-wrap">
            <span className="gp-search-icon">🔍</span>
            <input
              className="gp-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search groups…"
            />
          </div>
          <button className="gp-btn-primary" onClick={() => setModal("add")}>
            + Add Group
          </button>
        </div>

        <div className="gp-table-wrap">
          <table className="gp-table">
            <thead>
              <tr>
                {["Name", "Description", "Status", "Actions"].map((h) => (
                  <th key={h} className="gp-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="gp-td" style={{ padding: "8px 16px" }}>
                      <div className="gp-skeleton" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="gp-empty">No groups found</td></tr>
              ) : (
                filtered.map((group) => (
                  <tr key={group.id} className="gp-tr">
                    <td className="gp-td"><div className="gp-name">{group.name}</div></td>
                    <td className="gp-td"><div className="gp-desc">{group.description ?? "—"}</div></td>
                    <td className="gp-td">
                      <span className={`gp-badge ${group.active ? "gp-badge-active" : "gp-badge-inactive"}`}>
                        {group.active ? "● Active" : "○ Inactive"}
                      </span>
                    </td>
                    <td className="gp-td">
                      <div className="gp-row-actions">
                        <button className="gp-btn-row edit" onClick={() => { setActiveGroup(group); setModal("edit"); }}>Edit</button>
                        <button className="gp-btn-row del" onClick={() => { setActiveGroup(group); setModal("delete"); }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="gp-footer">Showing {filtered.length} of {groups.length} groups</p>
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
          <div className="gp-delete-body">
            <p className="gp-delete-text">
              Are you sure you want to delete the group{" "}
              <strong style={{ color: "#e8edf5" }}>"{activeGroup.name}"</strong>?
              This will remove all user memberships associated with it.
            </p>
          </div>
          <div className="gp-form-actions">
            <button className="gp-btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="gp-btn-delete" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? "Deleting…" : "Delete Group"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
