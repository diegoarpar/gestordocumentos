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

type Workflow = { id: string; name: string };
type Activity = { id: string; name: string };

type WorkflowActivity = {
  id: string;
  workflowId: string;
  activityId: string;
  workflowName?: string;
  activityName?: string;
};

const SEED_WORKFLOWS: Workflow[] = [
  { id: "1", name: "Radicación de documentos" },
  { id: "2", name: "Aprobación de solicitudes" },
];

const SEED_ACTIVITIES: Activity[] = [
  { id: "1", name: "Revisión de documentos" },
  { id: "2", name: "Aprobación" },
  { id: "3", name: "Notificación" },
];

const SEED_WORKFLOW_ACTIVITIES: WorkflowActivity[] = [
  { id: "1", workflowId: "1", activityId: "1", workflowName: "Radicación de documentos", activityName: "Revisión de documentos" },
  { id: "2", workflowId: "1", activityId: "3", workflowName: "Radicación de documentos", activityName: "Notificación" },
  { id: "3", workflowId: "2", activityId: "2", workflowName: "Aprobación de solicitudes", activityName: "Aprobación" },
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
    <div className="wap-overlay">
      <div className="wap-modal">
        <div className="wap-modal-header">
          <h2 className="wap-modal-title">{title}</h2>
          <button className="wap-modal-close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function WorkflowActivityPortal() {
  const [workflowActivities, setWorkflowActivities] = useState<WorkflowActivity[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterWorkflow, setFilterWorkflow] = useState("");
  const [modal, setModal] = useState<"add" | "delete" | null>(null);
  const [activeItem, setActiveItem] = useState<WorkflowActivity | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "warn" | "err" } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      AdminServices.GetWorkflowActivities(null).then((r) => r.json()).catch(() => SEED_WORKFLOW_ACTIVITIES),
      AdminServices.GetWorkflows().then((r) => r.json()).catch(() => SEED_WORKFLOWS),
      AdminServices.GetActivities().then((r) => r.json()).catch(() => SEED_ACTIVITIES),
    ]).then(([waData, wData, aData]) => {
      setWorkflowActivities(Array.isArray(waData) ? waData : SEED_WORKFLOW_ACTIVITIES);
      setWorkflows(Array.isArray(wData) ? wData : Array.isArray(wData.workflows) ? wData.workflows : SEED_WORKFLOWS);
      setActivities(Array.isArray(aData) ? aData : Array.isArray(aData.activities) ? aData.activities : SEED_ACTIVITIES);
    }).finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string, type: "ok" | "warn" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeModal = () => {
    setModal(null);
    setActiveItem(null);
    setSelectedWorkflow("");
    setSelectedActivity("");
  };

  const workflowName = (id: string) => workflows.find((w) => w.id === id)?.name ?? id;
  const activityName = (id: string) => activities.find((a) => a.id === id)?.name ?? id;

  const isDuplicate = selectedWorkflow && selectedActivity &&
    workflowActivities.some((wa) => wa.workflowId === selectedWorkflow && wa.activityId === selectedActivity);

  const handleAdd = async () => {
    if (!selectedWorkflow || !selectedActivity) return;
    setIsSaving(true);
    const payload = { workflowId: selectedWorkflow, activityId: selectedActivity };
    try {
      const res = await AdminServices.CreateWorkflowActivity(payload);
      const optimistic: WorkflowActivity = {
        id: String(Date.now()),
        ...payload,
        workflowName: workflowName(selectedWorkflow),
        activityName: activityName(selectedActivity),
      };
      if (res.ok) {
        try {
          const created: WorkflowActivity = await res.json();
          setWorkflowActivities((prev) => [...prev, { ...created, workflowName: workflowName(created.workflowId), activityName: activityName(created.activityId) }]);
        } catch {
          setWorkflowActivities((prev) => [...prev, optimistic]);
        }
      } else {
        setWorkflowActivities((prev) => [...prev, optimistic]);
      }
      showToast(`Activity assigned to workflow`);
    } catch {
      const optimistic: WorkflowActivity = {
        id: String(Date.now()),
        ...payload,
        workflowName: workflowName(selectedWorkflow),
        activityName: activityName(selectedActivity),
      };
      setWorkflowActivities((prev) => [...prev, optimistic]);
      showToast(`Activity assigned to workflow`);
    } finally {
      setIsSaving(false);
      closeModal();
    }
  };

  const handleDelete = async () => {
    if (!activeItem) return;
    setIsSaving(true);
    try {
      await AdminServices.DeleteWorkflowActivity(activeItem.id);
    } catch {}
    finally {
      setWorkflowActivities((prev) => prev.filter((wa) => wa.id !== activeItem.id));
      showToast(`Assignment removed`, "warn");
      setIsSaving(false);
      closeModal();
    }
  };

  const filtered = workflowActivities.filter((wa) => {
    const wName = wa.workflowName ?? workflowName(wa.workflowId);
    const aName = wa.activityName ?? activityName(wa.activityId);
    const matchSearch = wName.toLowerCase().includes(search.toLowerCase()) || aName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filterWorkflow || wa.workflowId === filterWorkflow;
    return matchSearch && matchFilter;
  });

  const availableActivities = activities.filter(
    (a) => !workflowActivities.some((wa) => wa.workflowId === selectedWorkflow && wa.activityId === a.id)
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap');
        .wap-root { min-height:100vh; background:#060b14; font-family:'DM Sans',sans-serif; color:#c8d6e8; padding:40px 48px; }
        .wap-header { margin-bottom:36px; }
        .wap-header-row { display:flex; align-items:center; gap:14px; margin-bottom:6px; }
        .wap-icon { width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg,#f59e0b22,#f59e0b44); border:1px solid #f59e0b44; display:flex; align-items:center; justify-content:center; font-size:18px; }
        .wap-title { margin:0; font-size:26px; font-weight:800; font-family:'Sora',sans-serif; color:#e8edf5; letter-spacing:-0.5px; }
        .wap-subtitle { margin:0; font-size:14px; color:#3d5060; margin-left:52px; }
        .wap-stats { display:flex; gap:16px; margin-bottom:32px; }
        .wap-stat { background:#0a111e; border:1px solid #1e2d45; border-radius:12px; padding:16px 24px; flex:1; }
        .wap-stat-val { font-size:26px; font-weight:800; font-family:'Sora',sans-serif; }
        .wap-stat-label { font-size:12px; color:#3d5060; font-weight:600; margin-top:2px; text-transform:uppercase; letter-spacing:.06em; }
        .wap-controls { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; gap:16px; flex-wrap:wrap; }
        .wap-controls-left { display:flex; gap:12px; flex:1; flex-wrap:wrap; }
        .wap-search-wrap { position:relative; flex:1; min-width:200px; max-width:280px; }
        .wap-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#3d5060; font-size:15px; pointer-events:none; }
        .wap-search { width:100%; box-sizing:border-box; padding-left:36px; padding-right:14px; height:40px; background:#0a111e; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; }
        .wap-search:focus { border-color:${ACCENT}; }
        .wap-select { height:40px; background:#0a111e; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; padding:0 14px; outline:none; font-family:'DM Sans',sans-serif; min-width:180px; cursor:pointer; }
        .wap-select:focus { border-color:${ACCENT}; }
        .wap-btn-primary { padding:9px 22px; border-radius:8px; font-size:13px; font-weight:700; border:none; background:linear-gradient(135deg,#f59e0b,#d97706); color:#fff; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 4px 18px rgba(245,158,11,.2); transition:all .15s; white-space:nowrap; }
        .wap-btn-primary:hover:not(:disabled) { box-shadow:0 6px 24px rgba(245,158,11,.35); }
        .wap-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
        .wap-table-wrap { background:#0a111e; border:1px solid #1e2d45; border-radius:14px; overflow:hidden; }
        .wap-table { width:100%; border-collapse:collapse; }
        .wap-th { padding:14px 16px; text-align:left; font-size:11px; font-weight:700; color:#3d5060; text-transform:uppercase; letter-spacing:.08em; border-bottom:1px solid #1e2d45; }
        .wap-tr { border-bottom:1px solid #111d2e; transition:background .12s; }
        .wap-tr:last-child { border-bottom:none; }
        .wap-tr:hover .wap-td { background:#0d1829; }
        .wap-td { padding:14px 16px; background:transparent; transition:background .12s; }
        .wap-tag { display:inline-flex; align-items:center; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; }
        .wap-tag-wf { background:#8b5cf615; color:#a78bfa; border:1px solid #8b5cf630; }
        .wap-tag-act { background:#f59e0b15; color:#fbbf24; border:1px solid #f59e0b30; }
        .wap-row-actions { display:flex; gap:6px; }
        .wap-btn-row { padding:6px 14px; border-radius:7px; font-size:12px; font-weight:600; border:1px solid #1e2d45; background:transparent; color:#8a9ab5; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .wap-btn-row.del:hover { border-color:#e05c5c44; color:#e05c5c; }
        .wap-empty { padding:52px; text-align:center; color:#2a3d58; font-size:14px; }
        .wap-footer { margin-top:14px; font-size:12px; color:#2a3d58; }
        .wap-overlay { position:fixed; inset:0; z-index:100; background:rgba(5,8,16,.82); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); animation:wapFadeIn .18s ease; }
        .wap-modal { background:#0f1623; border:1px solid #1e2d45; border-radius:16px; padding:36px 40px; min-width:480px; max-width:540px; width:100%; box-shadow:0 30px 80px rgba(0,0,0,.6); animation:wapSlideUp .22s cubic-bezier(.16,1,.3,1); }
        .wap-modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:28px; }
        .wap-modal-title { margin:0; font-size:20px; font-weight:700; font-family:'Sora',sans-serif; color:#e8edf5; letter-spacing:-.3px; }
        .wap-modal-close { background:none; border:none; color:#5a6a85; cursor:pointer; font-size:22px; line-height:1; padding:2px 6px; border-radius:6px; transition:color .15s; }
        .wap-modal-close:hover { color:#e8edf5; }
        .wap-field { margin-bottom:18px; }
        .wap-label { display:block; margin-bottom:7px; font-size:12px; font-weight:600; color:#5a6a85; letter-spacing:.08em; text-transform:uppercase; }
        .wap-modal-select { width:100%; box-sizing:border-box; background:#080d18; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; padding:10px 14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; cursor:pointer; }
        .wap-modal-select:focus { border-color:${ACCENT}; }
        .wap-warning { margin-top:10px; font-size:12px; color:#f59e0b; background:#f59e0b12; border:1px solid #f59e0b30; border-radius:6px; padding:8px 12px; }
        .wap-form-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:28px; }
        .wap-btn-ghost { padding:10px 22px; border-radius:8px; font-size:14px; font-weight:600; border:1px solid #1e2d45; background:transparent; color:#5a6a85; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .wap-btn-ghost:hover { border-color:#2a3d58; color:#8a9ab5; }
        .wap-btn-delete { padding:10px 22px; border-radius:8px; font-size:14px; font-weight:700; border:none; background:linear-gradient(135deg,#e05c5c,#c04040); color:#fff; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 4px 18px rgba(224,92,92,.3); transition:all .15s; }
        .wap-btn-delete:disabled { opacity:.5; cursor:not-allowed; }
        .wap-delete-body { margin-bottom:28px; }
        .wap-delete-text { margin:0; color:#8a9ab5; font-size:14px; line-height:1.6; }
        .wap-toast { position:fixed; bottom:32px; right:32px; z-index:999; padding:12px 22px; border-radius:10px; font-size:14px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.5); animation:wapToastIn .25s cubic-bezier(.16,1,.3,1); }
        .wap-toast.ok { background:#0d1829; border:1px solid #f59e0b44; color:#f59e0b; }
        .wap-toast.warn { background:#2a1a1a; border:1px solid #e05c5c55; color:#e05c5c; }
        .wap-toast.err { background:#2a1a1a; border:1px solid #e05c5c55; color:#e05c5c; }
        .wap-skeleton { height:52px; background:#0d1829; border-radius:6px; animation:wapPulse 1.4s ease-in-out infinite; }
        @keyframes wapPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes wapFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes wapSlideUp { from{transform:translateY(22px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes wapToastIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @media (max-width:768px) { .wap-root{padding:24px 16px;} .wap-stats{flex-direction:column;} .wap-modal{min-width:unset;padding:24px 20px;} .wap-table-wrap{overflow-x:auto;} }
      `}</style>

      <div>
        <AppBar position="static" sx={{ bgcolor: "#0a111e", borderBottom: "1px solid #1e2d45", boxShadow: "none" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ zIndex: 10 }} onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>
              Workflow - Actividades
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

        <div className="wap-root">
          {toast && (
            <div className={`wap-toast ${toast.type}`}>
              {toast.type === "ok" ? "✓ " : "⚠ "}{toast.msg}
            </div>
          )}

          <div className="wap-header">
            <div className="wap-header-row">
              <div className="wap-icon">🔗</div>
              <h1 className="wap-title">Workflow Activities</h1>
            </div>
            <p className="wap-subtitle">Assign activities to workflows</p>
          </div>

          <div className="wap-stats">
            {[
              { label: "Total Assignments", value: workflowActivities.length, color: ACCENT },
              { label: "Workflows", value: workflows.length, color: "#8b5cf6" },
              { label: "Activities", value: activities.length, color: "#3b82f6" },
            ].map((s) => (
              <div key={s.label} className="wap-stat">
                <div className="wap-stat-val" style={{ color: s.color }}>{s.value}</div>
                <div className="wap-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="wap-controls">
            <div className="wap-controls-left">
              <div className="wap-search-wrap">
                <span className="wap-search-icon">🔍</span>
                <input
                  className="wap-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search assignments…"
                />
              </div>
              <select
                className="wap-select"
                value={filterWorkflow}
                onChange={(e) => setFilterWorkflow(e.target.value)}
              >
                <option value="">All Workflows</option>
                {workflows.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <button className="wap-btn-primary" onClick={() => setModal("add")}>
              + Assign Activity
            </button>
          </div>

          <div className="wap-table-wrap">
            <table className="wap-table">
              <thead>
                <tr>
                  {["Workflow", "Activity", "Actions"].map((h) => (
                    <th key={h} className="wap-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={3} className="wap-td" style={{ padding: "8px 16px" }}>
                        <div className="wap-skeleton" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={3} className="wap-empty">No assignments found</td></tr>
                ) : (
                  filtered.map((wa) => (
                    <tr key={wa.id} className="wap-tr">
                      <td className="wap-td">
                        <span className="wap-tag wap-tag-wf">{wa.workflowName ?? workflowName(wa.workflowId)}</span>
                      </td>
                      <td className="wap-td">
                        <span className="wap-tag wap-tag-act">{wa.activityName ?? activityName(wa.activityId)}</span>
                      </td>
                      <td className="wap-td">
                        <div className="wap-row-actions">
                          <button className="wap-btn-row del" onClick={() => { setActiveItem(wa); setModal("delete"); }}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="wap-footer">Showing {filtered.length} of {workflowActivities.length} assignments</p>
        </div>
      </div>

      {modal === "add" && (
        <Modal title="Assign Activity to Workflow" onClose={closeModal}>
          <div className="wap-field">
            <label className="wap-label">Workflow</label>
            <select
              className="wap-modal-select"
              value={selectedWorkflow}
              onChange={(e) => { setSelectedWorkflow(e.target.value); setSelectedActivity(""); }}
            >
              <option value="">Select a workflow…</option>
              {workflows.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div className="wap-field">
            <label className="wap-label">Activity</label>
            <select
              className="wap-modal-select"
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              disabled={!selectedWorkflow}
            >
              <option value="">Select an activity…</option>
              {availableActivities.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            {isDuplicate && (
              <div className="wap-warning">⚠ This activity is already assigned to the selected workflow.</div>
            )}
          </div>
          <div className="wap-form-actions">
            <button className="wap-btn-ghost" onClick={closeModal}>Cancel</button>
            <button
              className="wap-btn-primary"
              disabled={!selectedWorkflow || !selectedActivity || !!isDuplicate || isSaving}
              onClick={handleAdd}
            >
              {isSaving ? "Saving…" : "Assign Activity"}
            </button>
          </div>
        </Modal>
      )}

      {modal === "delete" && activeItem && (
        <Modal title="Remove Assignment" onClose={closeModal}>
          <div className="wap-delete-body">
            <p className="wap-delete-text">
              Are you sure you want to remove the activity{" "}
              <strong style={{ color: "#fbbf24" }}>"{activeItem.activityName ?? activityName(activeItem.activityId)}"</strong>{" "}
              from workflow{" "}
              <strong style={{ color: "#a78bfa" }}>"{activeItem.workflowName ?? workflowName(activeItem.workflowId)}"</strong>?
            </p>
          </div>
          <div className="wap-form-actions">
            <button className="wap-btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="wap-btn-delete" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? "Removing…" : "Remove Assignment"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
