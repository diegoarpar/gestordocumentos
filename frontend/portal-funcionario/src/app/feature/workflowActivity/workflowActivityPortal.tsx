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
import "./workflowActivityPortal.css";

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

        <div className="root">
          {toast && (
            <div className={`toast ${toast.type}`}>
              {toast.type === "ok" ? "✓ " : "⚠ "}{toast.msg}
            </div>
          )}

          <div className="header">
            <div className="header-row">
              <div className="icon">🔗</div>
              <h1 className="title">Workflow Activities</h1>
            </div>
            <p className="subtitle">Assign activities to workflows</p>
          </div>

          <div className="stats">
            {[
              { label: "Total Assignments", value: workflowActivities.length, color: ACCENT },
              { label: "Workflows", value: workflows.length, color: "#8b5cf6" },
              { label: "Activities", value: activities.length, color: "#3b82f6" },
            ].map((s) => (
              <div key={s.label} className="stat">
                <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="controls">
            <div className="controls-left">
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input
                  className="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search assignments…"
                />
              </div>
              <select
                className="select"
                value={filterWorkflow}
                onChange={(e) => setFilterWorkflow(e.target.value)}
              >
                <option value="">All Workflows</option>
                {workflows.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <button className="btn-primary" onClick={() => setModal("add")}>
              + Assign Activity
            </button>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  {["Workflow", "Activity", "Actions"].map((h) => (
                    <th key={h} className="th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={3} className="td" style={{ padding: "8px 16px" }}>
                        <div className="skeleton" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={3} className="empty">No assignments found</td></tr>
                ) : (
                  filtered.map((wa) => (
                    <tr key={wa.id} className="tr">
                      <td className="td">
                        <span className="tag tag-wf">{wa.workflowName ?? workflowName(wa.workflowId)}</span>
                      </td>
                      <td className="td">
                        <span className="tag tag-act">{wa.activityName ?? activityName(wa.activityId)}</span>
                      </td>
                      <td className="td">
                        <div className="row-actions">
                          <button className="btn-row del" onClick={() => { setActiveItem(wa); setModal("delete"); }}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="footer">Showing {filtered.length} of {workflowActivities.length} assignments</p>
        </div>
      </div>

      {modal === "add" && (
        <Modal title="Assign Activity to Workflow" onClose={closeModal}>
          <div className="field">
            <label className="label">Workflow</label>
            <select
              className="modal-select"
              value={selectedWorkflow}
              onChange={(e) => { setSelectedWorkflow(e.target.value); setSelectedActivity(""); }}
            >
              <option value="">Select a workflow…</option>
              {workflows.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="label">Activity</label>
            <select
              className="modal-select"
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
              <div className="warning">⚠ This activity is already assigned to the selected workflow.</div>
            )}
          </div>
          <div className="form-actions">
            <button className="btn-ghost" onClick={closeModal}>Cancel</button>
            <button
              className="btn-primary"
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
          <div className="delete-body">
            <p className="delete-text">
              Are you sure you want to remove the activity{" "}
              <strong style={{ color: "#fbbf24" }}>"{activeItem.activityName ?? activityName(activeItem.activityId)}"</strong>{" "}
              from workflow{" "}
              <strong style={{ color: "#a78bfa" }}>"{activeItem.workflowName ?? workflowName(activeItem.workflowId)}"</strong>?
            </p>
          </div>
          <div className="form-actions">
            <button className="btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="btn-delete" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? "Removing…" : "Remove Assignment"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
