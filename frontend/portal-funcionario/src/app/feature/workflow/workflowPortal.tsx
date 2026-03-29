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
  { id: "1", name: "Radicación de documentos", description: "Flujo para radicar documentos entrantes", active: true },
  { id: "2", name: "Aprobación de solicitudes", description: "Flujo de aprobación multinivel", active: true },
  { id: "3", name: "Archivo digital", description: "Flujo de digitalización y archivo", active: false },
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap');
        .wfp-root { min-height:100vh; background:#060b14; font-family:'DM Sans',sans-serif; color:#c8d6e8; padding:40px 48px; }
        .wfp-header { margin-bottom:36px; }
        .wfp-header-row { display:flex; align-items:center; gap:14px; margin-bottom:6px; }
        .wfp-icon { width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg,#8b5cf622,#8b5cf644); border:1px solid #8b5cf644; display:flex; align-items:center; justify-content:center; font-size:18px; }
        .wfp-title { margin:0; font-size:26px; font-weight:800; font-family:'Sora',sans-serif; color:#e8edf5; letter-spacing:-0.5px; }
        .wfp-subtitle { margin:0; font-size:14px; color:#3d5060; margin-left:52px; }
        .wfp-stats { display:flex; gap:16px; margin-bottom:32px; }
        .wfp-stat { background:#0a111e; border:1px solid #1e2d45; border-radius:12px; padding:16px 24px; flex:1; }
        .wfp-stat-val { font-size:26px; font-weight:800; font-family:'Sora',sans-serif; }
        .wfp-stat-label { font-size:12px; color:#3d5060; font-weight:600; margin-top:2px; text-transform:uppercase; letter-spacing:.06em; }
        .wfp-controls { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; gap:16px; }
        .wfp-search-wrap { position:relative; flex:1; max-width:320px; }
        .wfp-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#3d5060; font-size:15px; pointer-events:none; }
        .wfp-search { width:100%; box-sizing:border-box; padding-left:36px; padding-right:14px; height:40px; background:#0a111e; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; }
        .wfp-search:focus { border-color:${ACCENT}; }
        .wfp-btn-primary { padding:9px 22px; border-radius:8px; font-size:13px; font-weight:700; border:none; background:linear-gradient(135deg,#8b5cf6,#7c3aed); color:#fff; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 4px 18px rgba(139,92,246,.2); transition:all .15s; }
        .wfp-btn-primary:hover:not(:disabled) { box-shadow:0 6px 24px rgba(139,92,246,.35); }
        .wfp-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
        .wfp-table-wrap { background:#0a111e; border:1px solid #1e2d45; border-radius:14px; overflow:hidden; }
        .wfp-table { width:100%; border-collapse:collapse; }
        .wfp-th { padding:14px 16px; text-align:left; font-size:11px; font-weight:700; color:#3d5060; text-transform:uppercase; letter-spacing:.08em; border-bottom:1px solid #1e2d45; }
        .wfp-tr { border-bottom:1px solid #111d2e; transition:background .12s; }
        .wfp-tr:last-child { border-bottom:none; }
        .wfp-tr:hover .wfp-td { background:#0d1829; }
        .wfp-td { padding:14px 16px; background:transparent; transition:background .12s; }
        .wfp-name { font-weight:700; color:#e8edf5; font-size:14px; font-family:'Sora',sans-serif; }
        .wfp-desc { font-size:13px; color:#5a6a85; max-width:260px; }
        .wfp-badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }
        .wfp-badge-active { background:#10b98115; color:#10b981; border:1px solid #10b98130; }
        .wfp-badge-inactive { background:#e05c5c12; color:#e05c5c; border:1px solid #e05c5c30; }
        .wfp-row-actions { display:flex; gap:6px; }
        .wfp-btn-row { padding:6px 14px; border-radius:7px; font-size:12px; font-weight:600; border:1px solid #1e2d45; background:transparent; color:#8a9ab5; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .wfp-btn-row.edit:hover { border-color:#8b5cf644; color:#8b5cf6; }
        .wfp-btn-row.del:hover { border-color:#e05c5c44; color:#e05c5c; }
        .wfp-empty { padding:52px; text-align:center; color:#2a3d58; font-size:14px; }
        .wfp-footer { margin-top:14px; font-size:12px; color:#2a3d58; }
        .wfp-overlay { position:fixed; inset:0; z-index:100; background:rgba(5,8,16,.82); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); animation:wfpFadeIn .18s ease; }
        .wfp-modal { background:#0f1623; border:1px solid #1e2d45; border-radius:16px; padding:36px 40px; min-width:480px; max-width:540px; width:100%; box-shadow:0 30px 80px rgba(0,0,0,.6); animation:wfpSlideUp .22s cubic-bezier(.16,1,.3,1); }
        .wfp-modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:28px; }
        .wfp-modal-title { margin:0; font-size:20px; font-weight:700; font-family:'Sora',sans-serif; color:#e8edf5; letter-spacing:-.3px; }
        .wfp-modal-close { background:none; border:none; color:#5a6a85; cursor:pointer; font-size:22px; line-height:1; padding:2px 6px; border-radius:6px; transition:color .15s; }
        .wfp-modal-close:hover { color:#e8edf5; }
        .wfp-form {}
        .wfp-field { margin-bottom:18px; }
        .wfp-field-inline { display:flex; align-items:center; gap:12px; }
        .wfp-field-inline .wfp-label { margin-bottom:0; }
        .wfp-label { display:block; margin-bottom:7px; font-size:12px; font-weight:600; color:#5a6a85; letter-spacing:.08em; text-transform:uppercase; }
        .wfp-input { width:100%; box-sizing:border-box; background:#080d18; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; padding:10px 14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; }
        .wfp-input:focus { border-color:${ACCENT}; }
        .wfp-textarea { resize:vertical; min-height:72px; }
        .wfp-toggle { width:44px; height:24px; border-radius:12px; background:#1e2d45; border:1px solid #2a3d58; cursor:pointer; position:relative; transition:background .2s,border-color .2s; flex-shrink:0; }
        .wfp-toggle.on { background:#8b5cf630; border-color:#8b5cf6; }
        .wfp-toggle-thumb { width:18px; height:18px; border-radius:50%; background:#3d5060; position:absolute; top:2px; left:3px; transition:transform .2s,background .2s; }
        .wfp-toggle.on .wfp-toggle-thumb { transform:translateX(20px); background:#8b5cf6; }
        .wfp-toggle-label { font-size:13px; color:#5a6a85; }
        .wfp-form-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:28px; }
        .wfp-btn-ghost { padding:10px 22px; border-radius:8px; font-size:14px; font-weight:600; border:1px solid #1e2d45; background:transparent; color:#5a6a85; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .wfp-btn-ghost:hover { border-color:#2a3d58; color:#8a9ab5; }
        .wfp-btn-delete { padding:10px 22px; border-radius:8px; font-size:14px; font-weight:700; border:none; background:linear-gradient(135deg,#e05c5c,#c04040); color:#fff; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 4px 18px rgba(224,92,92,.3); transition:all .15s; }
        .wfp-btn-delete:disabled { opacity:.5; cursor:not-allowed; }
        .wfp-delete-body { margin-bottom:28px; }
        .wfp-delete-text { margin:0; color:#8a9ab5; font-size:14px; line-height:1.6; }
        .wfp-toast { position:fixed; bottom:32px; right:32px; z-index:999; padding:12px 22px; border-radius:10px; font-size:14px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.5); animation:wfpToastIn .25s cubic-bezier(.16,1,.3,1); }
        .wfp-toast.ok { background:#0d1829; border:1px solid #8b5cf644; color:#8b5cf6; }
        .wfp-toast.warn { background:#2a1a1a; border:1px solid #e05c5c55; color:#e05c5c; }
        .wfp-toast.err { background:#2a1a1a; border:1px solid #e05c5c55; color:#e05c5c; }
        .wfp-skeleton { height:52px; background:#0d1829; border-radius:6px; animation:wfpPulse 1.4s ease-in-out infinite; }
        @keyframes wfpPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes wfpFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes wfpSlideUp { from{transform:translateY(22px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes wfpToastIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @media (max-width:768px) { .wfp-root{padding:24px 16px;} .wfp-stats{flex-direction:column;} .wfp-modal{min-width:unset;padding:24px 20px;} .wfp-table-wrap{overflow-x:auto;} }
      `}</style>

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
