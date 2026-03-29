"use client";
import React, { useState, useEffect } from "react";
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

type WorkflowDeployment = {
  id: string;
  workflowId: string;
  fileName: string;
  filePath: string;
  deployedBy: string;
  status: string;
  workflowName?: string;
};

type DeploymentPayload = {
  workflowId: string;
  fileName: string;
  filePath: string;
  deployedBy: string;
  status: string;
  file?: File;
};

const SEED_WORKFLOWS: Workflow[] = [
];

const SEED_DEPLOYMENTS: WorkflowDeployment[] = [
];

const STATUS_OPTIONS = ["PENDING", "DEPLOYED", "FAILED", "ARCHIVED"];
const ACCENT = "#10b981";

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
    <div className="wdp-overlay">
      <div className="wdp-modal">
        <div className="wdp-modal-header">
          <h2 className="wdp-modal-title">{title}</h2>
          <button className="wdp-modal-close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DeploymentForm({
  workflows,
  onSave,
  onCancel,
  isSaving,
}: {
  workflows: Workflow[];
  onSave: (data: DeploymentPayload) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [workflowId, setWorkflowId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [deployedBy, setDeployedBy] = useState("");
  const [status, setStatus] = useState("PENDING");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const valid = workflowId && file && deployedBy.trim();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  };

  return (
    <div className="wdp-form">
      <div className="wdp-field">
        <label className="wdp-label">Workflow</label>
        <select
          className="wdp-input wdp-select"
          value={workflowId}
          onChange={(e) => setWorkflowId(e.target.value)}
        >
          <option value="">Select a workflow…</option>
          {workflows.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </div>
      <div className="wdp-field">
        <label className="wdp-label">Process Definition File</label>
        <div className="wdp-file-wrap" onClick={() => fileInputRef.current?.click()}>
          <span className="wdp-file-icon">📎</span>
          <span className="wdp-file-name">
            {file ? file.name : "Click to select a .bpmn or .xml file…"}
          </span>
          {file && (
            <span className="wdp-file-size">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".bpmn,.xml,.zip"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      <div className="wdp-field">
        <label className="wdp-label">Deployed By</label>
        <input
          className="wdp-input"
          value={deployedBy}
          onChange={(e) => setDeployedBy(e.target.value)}
          placeholder="e.g. admin"
        />
      </div>
      <div className="wdp-field">
        <label className="wdp-label">Status</label>
        <select
          className="wdp-input wdp-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="wdp-form-actions">
        <button type="button" className="wdp-btn-ghost" onClick={onCancel}>Cancel</button>
        <button
          type="button"
          className="wdp-btn-primary"
          disabled={!valid || isSaving}
          onClick={() =>
            valid &&
            onSave({
              workflowId,
              fileName: file!.name,
              filePath: "",
              deployedBy: deployedBy.trim(),
              status,
              file: file!,
            })
          }
        >
          {isSaving ? "Uploading…" : "Deploy"}
        </button>
      </div>
    </div>
  );
}

function statusBadgeClass(status: string) {
  if (status === "DEPLOYED") return "wdp-badge-deployed";
  if (status === "PENDING") return "wdp-badge-pending";
  if (status === "FAILED") return "wdp-badge-failed";
  return "wdp-badge-archived";
}

export default function WorkflowDeploymentPortal() {
  const [deployments, setDeployments] = useState<WorkflowDeployment[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterWorkflow, setFilterWorkflow] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modal, setModal] = useState<"add" | "delete" | null>(null);
  const [activeDeployment, setActiveDeployment] = useState<WorkflowDeployment | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "warn" | "err" } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      AdminServices.GetWorkflowDeployments(null).then((r) => r.json()).catch(() => SEED_DEPLOYMENTS),
      AdminServices.GetWorkflows().then((r) => r.json()).catch(() => SEED_WORKFLOWS),
    ]).then(([dData, wData]) => {
      setDeployments(Array.isArray(dData) ? dData : SEED_DEPLOYMENTS);
      setWorkflows(Array.isArray(wData) ? wData : Array.isArray(wData.workflows) ? wData.workflows : SEED_WORKFLOWS);
    }).finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string, type: "ok" | "warn" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeModal = () => {
    setModal(null);
    setActiveDeployment(null);
  };

  const workflowName = (id: string) => workflows.find((w) => w.id === id)?.name ?? id;

  const handleAdd = async (payload: DeploymentPayload) => {
    setIsSaving(true);
    let uploadedPath = "";
    try {
      // // Step 1: upload the file to the process definition endpoint
      // if (payload.file) {
      //   const uploadRes = await AdminServices.UploadProcessDefinition(payload.file);
      //   if (uploadRes.ok) {
      //     try {
      //       const uploadData = await uploadRes.json();
      //       uploadedPath = uploadData?.filePath ?? uploadData?.path ?? payload.fileName;
      //     } catch {
      //       uploadedPath = payload.fileName;
      //     }
      //   } else {
      //     showToast("File upload failed — check the backend", "err");
      //     setIsSaving(false);
      //     return;
      //   }
      // }

      // Step 2: create the deployment record with file metadata
      const deploymentPayload = {
        workflowId: payload.workflowId,
        fileName: payload.fileName,
        filePath: uploadedPath || payload.fileName,
        deployedBy: payload.deployedBy,
        status: payload.status,
        file: payload.file
      };
      const res = await AdminServices.CreateWorkflowDeployment(deploymentPayload);
      const optimistic: WorkflowDeployment = {
        id: String(Date.now()),
        ...deploymentPayload,
        workflowName: workflowName(payload.workflowId),
      };
      if (res.ok) {
        try {
          const created: WorkflowDeployment = await res.json();
          setDeployments((prev) => [...prev, { ...created, workflowName: workflowName(created.workflowId) }]);
        } catch {
          setDeployments((prev) => [...prev, optimistic]);
        }
      } else {
        setDeployments((prev) => [...prev, optimistic]);
      }
      showToast(`Deployment "${payload.fileName}" created`);
    } catch {
      showToast("Deployment failed — check connection", "err");
    } finally {
      setIsSaving(false);
      closeModal();
    }
  };

  const handleDelete = async () => {
    if (!activeDeployment) return;
    setIsSaving(true);
    try {
      await AdminServices.DeleteWorkflowDeployment(activeDeployment.id);
    } catch {}
    finally {
      setDeployments((prev) => prev.filter((d) => d.id !== activeDeployment.id));
      showToast(`Deployment "${activeDeployment.fileName}" deleted`, "warn");
      setIsSaving(false);
      closeModal();
    }
  };

  const filtered = deployments.filter((d) => {
    const wName = d.workflowName ?? workflowName(d.workflowId);
    const matchSearch =
      d.fileName.toLowerCase().includes(search.toLowerCase()) ||
      wName.toLowerCase().includes(search.toLowerCase()) ||
      d.deployedBy.toLowerCase().includes(search.toLowerCase());
    const matchWorkflow = !filterWorkflow || d.workflowId === filterWorkflow;
    const matchStatus = !filterStatus || d.status === filterStatus;
    return matchSearch && matchWorkflow && matchStatus;
  });

  const deployedCount = deployments.filter((d) => d.status === "DEPLOYED").length;
  const pendingCount = deployments.filter((d) => d.status === "PENDING").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap');
        .wdp-root { min-height:100vh; background:#060b14; font-family:'DM Sans',sans-serif; color:#c8d6e8; padding:40px 48px; }
        .wdp-header { margin-bottom:36px; }
        .wdp-header-row { display:flex; align-items:center; gap:14px; margin-bottom:6px; }
        .wdp-icon { width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg,#10b98122,#10b98144); border:1px solid #10b98144; display:flex; align-items:center; justify-content:center; font-size:18px; }
        .wdp-title { margin:0; font-size:26px; font-weight:800; font-family:'Sora',sans-serif; color:#e8edf5; letter-spacing:-0.5px; }
        .wdp-subtitle { margin:0; font-size:14px; color:#3d5060; margin-left:52px; }
        .wdp-stats { display:flex; gap:16px; margin-bottom:32px; }
        .wdp-stat { background:#0a111e; border:1px solid #1e2d45; border-radius:12px; padding:16px 24px; flex:1; }
        .wdp-stat-val { font-size:26px; font-weight:800; font-family:'Sora',sans-serif; }
        .wdp-stat-label { font-size:12px; color:#3d5060; font-weight:600; margin-top:2px; text-transform:uppercase; letter-spacing:.06em; }
        .wdp-controls { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; gap:16px; flex-wrap:wrap; }
        .wdp-controls-left { display:flex; gap:12px; flex:1; flex-wrap:wrap; }
        .wdp-search-wrap { position:relative; flex:1; min-width:180px; max-width:240px; }
        .wdp-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#3d5060; font-size:15px; pointer-events:none; }
        .wdp-search { width:100%; box-sizing:border-box; padding-left:36px; padding-right:14px; height:40px; background:#0a111e; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; }
        .wdp-search:focus { border-color:${ACCENT}; }
        .wdp-filter-select { height:40px; background:#0a111e; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; padding:0 14px; outline:none; font-family:'DM Sans',sans-serif; min-width:160px; cursor:pointer; }
        .wdp-filter-select:focus { border-color:${ACCENT}; }
        .wdp-btn-primary { padding:9px 22px; border-radius:8px; font-size:13px; font-weight:700; border:none; background:linear-gradient(135deg,#10b981,#059669); color:#fff; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 4px 18px rgba(16,185,129,.2); transition:all .15s; white-space:nowrap; }
        .wdp-btn-primary:hover:not(:disabled) { box-shadow:0 6px 24px rgba(16,185,129,.35); }
        .wdp-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
        .wdp-table-wrap { background:#0a111e; border:1px solid #1e2d45; border-radius:14px; overflow:hidden; }
        .wdp-table { width:100%; border-collapse:collapse; }
        .wdp-th { padding:14px 16px; text-align:left; font-size:11px; font-weight:700; color:#3d5060; text-transform:uppercase; letter-spacing:.08em; border-bottom:1px solid #1e2d45; }
        .wdp-tr { border-bottom:1px solid #111d2e; transition:background .12s; }
        .wdp-tr:last-child { border-bottom:none; }
        .wdp-tr:hover .wdp-td { background:#0d1829; }
        .wdp-td { padding:14px 16px; background:transparent; transition:background .12s; }
        .wdp-name { font-weight:700; color:#e8edf5; font-size:14px; font-family:'Sora',sans-serif; }
        .wdp-meta { font-size:12px; color:#5a6a85; margin-top:2px; }
        .wdp-tag-wf { display:inline-flex; align-items:center; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; background:#8b5cf615; color:#a78bfa; border:1px solid #8b5cf630; }
        .wdp-badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }
        .wdp-badge-deployed { background:#10b98115; color:#10b981; border:1px solid #10b98130; }
        .wdp-badge-pending { background:#f59e0b15; color:#fbbf24; border:1px solid #f59e0b30; }
        .wdp-badge-failed { background:#e05c5c12; color:#e05c5c; border:1px solid #e05c5c30; }
        .wdp-badge-archived { background:#5a6a8515; color:#8a9ab5; border:1px solid #5a6a8530; }
        .wdp-row-actions { display:flex; gap:6px; }
        .wdp-btn-row { padding:6px 14px; border-radius:7px; font-size:12px; font-weight:600; border:1px solid #1e2d45; background:transparent; color:#8a9ab5; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .wdp-btn-row.del:hover { border-color:#e05c5c44; color:#e05c5c; }
        .wdp-empty { padding:52px; text-align:center; color:#2a3d58; font-size:14px; }
        .wdp-footer { margin-top:14px; font-size:12px; color:#2a3d58; }
        .wdp-overlay { position:fixed; inset:0; z-index:100; background:rgba(5,8,16,.82); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); animation:wdpFadeIn .18s ease; }
        .wdp-modal { background:#0f1623; border:1px solid #1e2d45; border-radius:16px; padding:36px 40px; min-width:480px; max-width:540px; width:100%; box-shadow:0 30px 80px rgba(0,0,0,.6); animation:wdpSlideUp .22s cubic-bezier(.16,1,.3,1); }
        .wdp-modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:28px; }
        .wdp-modal-title { margin:0; font-size:20px; font-weight:700; font-family:'Sora',sans-serif; color:#e8edf5; letter-spacing:-.3px; }
        .wdp-modal-close { background:none; border:none; color:#5a6a85; cursor:pointer; font-size:22px; line-height:1; padding:2px 6px; border-radius:6px; transition:color .15s; }
        .wdp-modal-close:hover { color:#e8edf5; }
        .wdp-form {}
        .wdp-field { margin-bottom:18px; }
        .wdp-label { display:block; margin-bottom:7px; font-size:12px; font-weight:600; color:#5a6a85; letter-spacing:.08em; text-transform:uppercase; }
        .wdp-input { width:100%; box-sizing:border-box; background:#080d18; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; padding:10px 14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; }
        .wdp-input:focus { border-color:${ACCENT}; }
        .wdp-select { cursor:pointer; }
        .wdp-file-wrap { display:flex; align-items:center; gap:10px; background:#080d18; border:1px dashed #2a3d58; border-radius:8px; padding:12px 16px; cursor:pointer; transition:border-color .15s,background .15s; }
        .wdp-file-wrap:hover { border-color:${ACCENT}; background:#0a1520; }
        .wdp-file-icon { font-size:18px; flex-shrink:0; }
        .wdp-file-name { font-size:13px; color:#8a9ab5; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .wdp-file-size { font-size:11px; color:#3d5060; font-weight:600; white-space:nowrap; }
        .wdp-form-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:28px; }
        .wdp-btn-ghost { padding:10px 22px; border-radius:8px; font-size:14px; font-weight:600; border:1px solid #1e2d45; background:transparent; color:#5a6a85; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .wdp-btn-ghost:hover { border-color:#2a3d58; color:#8a9ab5; }
        .wdp-btn-delete { padding:10px 22px; border-radius:8px; font-size:14px; font-weight:700; border:none; background:linear-gradient(135deg,#e05c5c,#c04040); color:#fff; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 4px 18px rgba(224,92,92,.3); transition:all .15s; }
        .wdp-btn-delete:disabled { opacity:.5; cursor:not-allowed; }
        .wdp-delete-body { margin-bottom:28px; }
        .wdp-delete-text { margin:0; color:#8a9ab5; font-size:14px; line-height:1.6; }
        .wdp-toast { position:fixed; bottom:32px; right:32px; z-index:999; padding:12px 22px; border-radius:10px; font-size:14px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.5); animation:wdpToastIn .25s cubic-bezier(.16,1,.3,1); }
        .wdp-toast.ok { background:#0d1829; border:1px solid #10b98144; color:#10b981; }
        .wdp-toast.warn { background:#2a1a1a; border:1px solid #e05c5c55; color:#e05c5c; }
        .wdp-toast.err { background:#2a1a1a; border:1px solid #e05c5c55; color:#e05c5c; }
        .wdp-skeleton { height:52px; background:#0d1829; border-radius:6px; animation:wdpPulse 1.4s ease-in-out infinite; }
        @keyframes wdpPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes wdpFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes wdpSlideUp { from{transform:translateY(22px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes wdpToastIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @media (max-width:768px) { .wdp-root{padding:24px 16px;} .wdp-stats{flex-direction:column;} .wdp-modal{min-width:unset;padding:24px 20px;} .wdp-table-wrap{overflow-x:auto;} }
      `}</style>

      <div>
        <AppBar position="static" sx={{ bgcolor: "#0a111e", borderBottom: "1px solid #1e2d45", boxShadow: "none" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ zIndex: 10 }} onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>
              Despliegues de Workflow
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

        <div className="wdp-root">
          {toast && (
            <div className={`wdp-toast ${toast.type}`}>
              {toast.type === "ok" ? "✓ " : "⚠ "}{toast.msg}
            </div>
          )}

          <div className="wdp-header">
            <div className="wdp-header-row">
              <div className="wdp-icon">🚀</div>
              <h1 className="wdp-title">Workflow Deployments</h1>
            </div>
            <p className="wdp-subtitle">Manage and track workflow process deployments</p>
          </div>

          <div className="wdp-stats">
            {[
              { label: "Total Deployments", value: deployments.length, color: ACCENT },
              { label: "Deployed", value: deployedCount, color: "#10b981" },
              { label: "Pending", value: pendingCount, color: "#f59e0b" },
            ].map((s) => (
              <div key={s.label} className="wdp-stat">
                <div className="wdp-stat-val" style={{ color: s.color }}>{s.value}</div>
                <div className="wdp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="wdp-controls">
            <div className="wdp-controls-left">
              <div className="wdp-search-wrap">
                <span className="wdp-search-icon">🔍</span>
                <input
                  className="wdp-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search deployments…"
                />
              </div>
              <select
                className="wdp-filter-select"
                value={filterWorkflow}
                onChange={(e) => setFilterWorkflow(e.target.value)}
              >
                <option value="">All Workflows</option>
                {workflows.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
              <select
                className="wdp-filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <button className="wdp-btn-primary" onClick={() => setModal("add")}>
              + New Deployment
            </button>
          </div>

          <div className="wdp-table-wrap">
            <table className="wdp-table">
              <thead>
                <tr>
                  {["File", "Workflow", "Deployed By", "Status", "Actions"].map((h) => (
                    <th key={h} className="wdp-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="wdp-td" style={{ padding: "8px 16px" }}>
                        <div className="wdp-skeleton" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="wdp-empty">No deployments found</td></tr>
                ) : (
                  filtered.map((dep) => (
                    <tr key={dep.id} className="wdp-tr">
                      <td className="wdp-td">
                        <div className="wdp-name">{dep.fileName}</div>
                        {dep.filePath && <div className="wdp-meta">{dep.filePath}</div>}
                      </td>
                      <td className="wdp-td">
                        <span className="wdp-tag-wf">{dep.workflowName ?? workflowName(dep.workflowId)}</span>
                      </td>
                      <td className="wdp-td" style={{ color: "#8a9ab5", fontSize: "13px" }}>{dep.deployedBy}</td>
                      <td className="wdp-td">
                        <span className={`wdp-badge ${statusBadgeClass(dep.status)}`}>
                          {dep.status}
                        </span>
                      </td>
                      <td className="wdp-td">
                        <div className="wdp-row-actions">
                          <button className="wdp-btn-row del" onClick={() => { setActiveDeployment(dep); setModal("delete"); }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="wdp-footer">Showing {filtered.length} of {deployments.length} deployments</p>
        </div>
      </div>

      {modal === "add" && (
        <Modal title="New Deployment" onClose={closeModal}>
          <DeploymentForm workflows={workflows} onSave={handleAdd} onCancel={closeModal} isSaving={isSaving} />
        </Modal>
      )}

      {modal === "delete" && activeDeployment && (
        <Modal title="Delete Deployment" onClose={closeModal}>
          <div className="wdp-delete-body">
            <p className="wdp-delete-text">
              Are you sure you want to delete the deployment{" "}
              <strong style={{ color: "#e8edf5" }}>"{activeDeployment.fileName}"</strong>?
            </p>
          </div>
          <div className="wdp-form-actions">
            <button className="wdp-btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="wdp-btn-delete" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? "Deleting…" : "Delete Deployment"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
