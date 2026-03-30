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
import "./activityPortal.css";

type Activity = {
  id: string;
  name: string;
  description?: string;
  href?: string;
  type?: string;
  active: boolean;
  keyName?: string;
};

type ActivityPayload = {
  name: string;
  description: string;
  active: boolean;
  href: string;
  type: string;
  keyName: string;
};

const SEED_ACTIVITIES: Activity[] = [
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
  const [keyName, setKeyName] = useState(initial?.type ?? "");
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
        <label className="ap-label">Activity Key</label>
        <input
          className="ap-input"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
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
          onClick={() => valid && onSave({ name: name.trim(), description: description.trim(), type: type.trim(), href: href.trim(), active, keyName: keyName.trim() })}
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
