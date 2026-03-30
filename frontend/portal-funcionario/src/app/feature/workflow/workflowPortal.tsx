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
import "./workflowPortal.css";

type Workflow = {
  id: string;
  name: string;
  description?: string;
  href?: string;
  latestKeyName?: string;
  active: boolean;
};

type WorkflowPayload = {
  name: string;
  description: string;
  href: string;
  latestKeyName: string;
  active: boolean;
};

const SEED_WORKFLOWS: Workflow[] = [
];

const ACCENT = "#8b5cf6";

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
    <div className="wfp-overlay">
      <div className="wfp-modal">
        <div className="wfp-modal-header">
          <h2 className="wfp-modal-title">{title}</h2>
          <button className="wfp-modal-close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function WorkflowForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial?: Workflow;
  onSave: (data: WorkflowPayload) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [latestKeyName, setLatestKeyName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [href, setHref] = useState(initial?.href ?? "");
  const valid = name.trim().length > 0;

  return (
    <div className="wfp-form">
      <div className="wfp-field">
        <label className="wfp-label">Workflow Name</label>
        <input
          className="wfp-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Document Approval Flow"
        />
      </div>
      <div className="wfp-field">
        <label className="wfp-label">Workflow Key</label>
        <input
          className="wfp-input"
          value={latestKeyName}
          onChange={(e) => setLatestKeyName(e.target.value)}
          placeholder="e.g. Document Approval Flow"
        />
      </div>
      <div className="wfp-field">
        <label className="wfp-label">Description</label>
        <textarea
          className="wfp-input wfp-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this workflow's purpose..."
          rows={3}
        />
      </div>
      <div className="wfp-field">
        <label className="wfp-label">URL</label>
        <textarea
          className="wfp-input wfp-textarea"
          value={href}
          onChange={(e) => setHref(e.target.value)}
          placeholder="URL..."
          rows={3}
        />
      </div>
      <div className="wfp-field wfp-field-inline">
        <label className="wfp-label">Active</label>
        <div
          className={`wfp-toggle ${active ? "on" : ""}`}
          onClick={() => setActive((v) => !v)}
          role="switch"
          aria-checked={active}
        >
          <div className="wfp-toggle-thumb" />
        </div>
        <span className="wfp-toggle-label">{active ? "Active" : "Inactive"}</span>
      </div>
      <div className="wfp-form-actions">
        <button type="button" className="wfp-btn-ghost" onClick={onCancel}>Cancel</button>
        <button
          type="button"
          className="wfp-btn-primary"
          disabled={!valid || isSaving}
          onClick={() => valid && onSave({ name: name.trim(), description: description.trim(), href: href.trim(), active, latestKeyName: latestKeyName.trim() })}
        >
          {isSaving ? "Saving…" : initial ? "Save Changes" : "Create Workflow"}
        </button>
      </div>
    </div>
  );
}

export default function WorkflowPortal() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "warn" | "err" } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    AdminServices.GetWorkflows()
      .then((res) => res.json())
      .then((data) => {
        setWorkflows(Array.isArray(data) ? data : Array.isArray(data.workflows) ? data.workflows : SEED_WORKFLOWS);
      })
      .catch(() => setWorkflows(SEED_WORKFLOWS))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string, type: "ok" | "warn" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeModal = () => {
    setModal(null);
    setActiveWorkflow(null);
  };

  const handleAdd = async (payload: WorkflowPayload) => {
    setIsSaving(true);
    try {
      const res = await AdminServices.CreateWorkflow(payload);
      const optimistic: Workflow = { ...payload, id: String(Date.now()) };
      if (res.ok) {
        try {
          const created: Workflow = await res.json();
          setWorkflows((prev) => [...prev, created]);
        } catch {
          setWorkflows((prev) => [...prev, optimistic]);
        }
      } else {
        setWorkflows((prev) => [...prev, optimistic]);
      }
      showToast(`Workflow "${payload.name}" created`);
    } catch {
      const optimistic: Workflow = { ...payload, id: String(Date.now()) };
      setWorkflows((prev) => [...prev, optimistic]);
      showToast(`Workflow "${payload.name}" created`);
    } finally {
      setIsSaving(false);
      closeModal();
    }
  };

  const handleUpdate = async (payload: WorkflowPayload) => {
    if (!activeWorkflow) return;
    setIsSaving(true);
    try {
      await AdminServices.UpdateWorkflow(activeWorkflow.id, payload);
      setWorkflows((prev) =>
        prev.map((w) => (w.id === activeWorkflow.id ? { ...w, ...payload } : w))
      );
      showToast(`Workflow "${payload.name}" updated`);
    } catch {
      setWorkflows((prev) =>
        prev.map((w) => (w.id === activeWorkflow.id ? { ...w, ...payload } : w))
      );
      showToast(`Workflow "${payload.name}" updated`);
    } finally {
      setIsSaving(false);
      closeModal();
    }
  };

  const handleDelete = async () => {
    if (!activeWorkflow) return;
    setIsSaving(true);
    try {
      await AdminServices.DeleteWorkflow(activeWorkflow.id);
    } catch {}
    finally {
      setWorkflows((prev) => prev.filter((w) => w.id !== activeWorkflow.id));
      showToast(`Workflow "${activeWorkflow.name}" deleted`, "warn");
      setIsSaving(false);
      closeModal();
    }
  };

  const filtered = workflows.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      (w.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = workflows.filter((w) => w.active).length;

  return (
    <>
      <div>
        <AppBar position="static" sx={{ bgcolor: "#0a111e", borderBottom: "1px solid #1e2d45", boxShadow: "none" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ zIndex: 10 }} onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>
              Gestión de Workflows
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

        <div className="wfp-root">
          {toast && (
            <div className={`wfp-toast ${toast.type}`}>
              {toast.type === "ok" ? "✓ " : "⚠ "}{toast.msg}
            </div>
          )}

          <div className="wfp-header">
            <div className="wfp-header-row">
              <div className="wfp-icon">🔄</div>
              <h1 className="wfp-title">Workflow Management</h1>
            </div>
            <p className="wfp-subtitle">Create and manage workflow process definitions</p>
          </div>

          <div className="wfp-stats">
            {[
              { label: "Total Workflows", value: workflows.length, color: ACCENT },
              { label: "Active", value: activeCount, color: "#10b981" },
              { label: "Inactive", value: workflows.length - activeCount, color: "#e05c5c" },
            ].map((s) => (
              <div key={s.label} className="wfp-stat">
                <div className="wfp-stat-val" style={{ color: s.color }}>{s.value}</div>
                <div className="wfp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="wfp-controls">
            <div className="wfp-search-wrap">
              <span className="wfp-search-icon">🔍</span>
              <input
                className="wfp-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search workflows…"
              />
            </div>
            <button className="wfp-btn-primary" onClick={() => setModal("add")}>
              + Add Workflow
            </button>
          </div>

          <div className="wfp-table-wrap">
            <table className="wfp-table">
              <thead>
                <tr>
                  {["Name", "Description", "Status", "Actions"].map((h) => (
                    <th key={h} className="wfp-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={4} className="wfp-td" style={{ padding: "8px 16px" }}>
                        <div className="wfp-skeleton" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={4} className="wfp-empty">No workflows found</td></tr>
                ) : (
                  filtered.map((workflow) => (
                    <tr key={workflow.id} className="wfp-tr">
                      <td className="wfp-td"><div className="wfp-name">{workflow.name}</div></td>
                      <td className="wfp-td"><div className="wfp-desc">{workflow.description ?? "—"}</div></td>
                      <td className="wfp-td">
                        <span className={`wfp-badge ${workflow.active ? "wfp-badge-active" : "wfp-badge-inactive"}`}>
                          {workflow.active ? "● Active" : "○ Inactive"}
                        </span>
                      </td>
                      <td className="wfp-td">
                        <div className="wfp-row-actions">
                          <button className="wfp-btn-row edit" onClick={() => { setActiveWorkflow(workflow); setModal("edit"); }}>Edit</button>
                          <button className="wfp-btn-row del" onClick={() => { setActiveWorkflow(workflow); setModal("delete"); }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="wfp-footer">Showing {filtered.length} of {workflows.length} workflows</p>
        </div>
      </div>

      {modal === "add" && (
        <Modal title="Create New Workflow" onClose={closeModal}>
          <WorkflowForm onSave={handleAdd} onCancel={closeModal} isSaving={isSaving} />
        </Modal>
      )}
      {modal === "edit" && activeWorkflow && (
        <Modal title="Edit Workflow" onClose={closeModal}>
          <WorkflowForm initial={activeWorkflow} onSave={handleUpdate} onCancel={closeModal} isSaving={isSaving} />
        </Modal>
      )}
      {modal === "delete" && activeWorkflow && (
        <Modal title="Delete Workflow" onClose={closeModal}>
          <div className="wfp-delete-body">
            <p className="wfp-delete-text">
              Are you sure you want to delete the workflow{" "}
              <strong style={{ color: "#e8edf5" }}>"{activeWorkflow.name}"</strong>?
              This will also remove all associated activities and deployments.
            </p>
          </div>
          <div className="wfp-form-actions">
            <button className="wfp-btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="wfp-btn-delete" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? "Deleting…" : "Delete Workflow"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
