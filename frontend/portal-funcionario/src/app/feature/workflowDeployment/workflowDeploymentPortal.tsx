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
import "./workflowDeploymentPortal.css";

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
    <div className="form">
      <div className="field">
        <label className="label">Workflow</label>
        <select
          className="input select"
          value={workflowId}
          onChange={(e) => setWorkflowId(e.target.value)}
        >
          <option value="">Select a workflow…</option>
          {workflows.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label className="label">Process Definition File</label>
        <div className="file-wrap" onClick={() => fileInputRef.current?.click()}>
          <span className="file-icon">📎</span>
          <span className="file-name">
            {file ? file.name : "Click to select a .bpmn or .xml file…"}
          </span>
          {file && (
            <span className="file-size">
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
      <div className="field">
        <label className="label">Deployed By</label>
        <input
          className="input"
          value={deployedBy}
          onChange={(e) => setDeployedBy(e.target.value)}
          placeholder="e.g. admin"
        />
      </div>
      <div className="field">
        <label className="label">Status</label>
        <select
          className="input select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button
          type="button"
          className="btn-primary"
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
  if (status === "DEPLOYED") return "badge-deployed";
  if (status === "PENDING") return "badge-pending";
  if (status === "FAILED") return "badge-failed";
  return "badge-archived";
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

        <div className="root">
          {toast && (
            <div className={`toast ${toast.type}`}>
              {toast.type === "ok" ? "✓ " : "⚠ "}{toast.msg}
            </div>
          )}

          <div className="header">
            <div className="header-row">
              <div className="icon">🚀</div>
              <h1 className="title">Workflow Deployments</h1>
            </div>
            <p className="subtitle">Manage and track workflow process deployments</p>
          </div>

          <div className="stats">
            {[
              { label: "Total Deployments", value: deployments.length, color: ACCENT },
              { label: "Deployed", value: deployedCount, color: "#10b981" },
              { label: "Pending", value: pendingCount, color: "#f59e0b" },
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
                  placeholder="Search deployments…"
                />
              </div>
              <select
                className="filter-select"
                value={filterWorkflow}
                onChange={(e) => setFilterWorkflow(e.target.value)}
              >
                <option value="">All Workflows</option>
                {workflows.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <button className="btn-primary" onClick={() => setModal("add")}>
              + New Deployment
            </button>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  {["File", "Workflow", "Deployed By", "Status", "Actions"].map((h) => (
                    <th key={h} className="th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="td" style={{ padding: "8px 16px" }}>
                        <div className="skeleton" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="empty">No deployments found</td></tr>
                ) : (
                  filtered.map((dep) => (
                    <tr key={dep.id} className="tr">
                      <td className="td">
                        <div className="name">{dep.fileName}</div>
                        {dep.filePath && <div className="meta">{dep.filePath}</div>}
                      </td>
                      <td className="td">
                        <span className="tag-wf">{dep.workflowName ?? workflowName(dep.workflowId)}</span>
                      </td>
                      <td className="td" style={{ color: "#8a9ab5", fontSize: "13px" }}>{dep.deployedBy}</td>
                      <td className="td">
                        <span className={`badge ${statusBadgeClass(dep.status)}`}>
                          {dep.status}
                        </span>
                      </td>
                      <td className="td">
                        <div className="row-actions">
                          <button className="btn-row del" onClick={() => { setActiveDeployment(dep); setModal("delete"); }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="footer">Showing {filtered.length} of {deployments.length} deployments</p>
        </div>
      </div>

      {modal === "add" && (
        <Modal title="New Deployment" onClose={closeModal}>
          <DeploymentForm workflows={workflows} onSave={handleAdd} onCancel={closeModal} isSaving={isSaving} />
        </Modal>
      )}

      {modal === "delete" && activeDeployment && (
        <Modal title="Delete Deployment" onClose={closeModal}>
          <div className="delete-body">
            <p className="delete-text">
              Are you sure you want to delete the deployment{" "}
              <strong style={{ color: "#e8edf5" }}>"{activeDeployment.fileName}"</strong>?
            </p>
          </div>
          <div className="form-actions">
            <button className="btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="btn-delete" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? "Deleting…" : "Delete Deployment"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
