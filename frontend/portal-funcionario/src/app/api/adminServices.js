// Activities
async function GetActivities() {
  return fetch("/api/workflow/activities", { method: "GET" });
}
async function CreateActivity(data) {
  return fetch("/api/workflow/activities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
async function UpdateActivity(id, data) {
  return fetch(`/api/workflow/activities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
async function DeleteActivity(id) {
  return fetch(`/api/workflow/activities/${id}`, { method: "DELETE" });
}

// Workflows
async function GetWorkflows() {
  return fetch("/api/workflow/workflows", { method: "GET" });
}
async function CreateWorkflow(data) {
  return fetch("/api/workflow/workflows", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
async function UpdateWorkflow(id, data) {
  return fetch(`/api/workflow/workflows/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
async function DeleteWorkflow(id) {
  return fetch(`/api/workflow/workflows/${id}`, { method: "DELETE" });
}

// Workflow Activities
async function GetWorkflowActivities(workflowId) {
  const url = workflowId
    ? `/api/workflow/workflow-activities?workflowId=${workflowId}`
    : "/api/workflow/workflow-activities";
  return fetch(url, { method: "GET" });
}
async function CreateWorkflowActivity(data) {
  return fetch("/api/workflow/workflow-activities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
async function DeleteWorkflowActivity(id) {
  return fetch(`/api/workflow/workflow-activities/${id}`, { method: "DELETE" });
}

// Process Definition upload (multipart)
async function UploadProcessDefinition(file) {
  const formData = new FormData();
  formData.append("file", file);
  return fetch("/api/workflow/process/definition", {
    method: "POST",
    body: formData,
  });
}

// Workflow Deployments
async function GetWorkflowDeployments(workflowId) {
  const url = workflowId
    ? `/api/workflow/workflow-deployments?workflowId=${workflowId}`
    : "/api/workflow/workflow-deployments";
  return fetch(url, { method: "GET" });
}
async function CreateWorkflowDeployment(data) {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("deployedBy", data.deployedBy);
  formData.append("fileName", data.fileName);
  formData.append("filePath", data.filePath);
  formData.append("status", data.status);
  formData.append("workflowId", data.workflowId);
  return fetch("/api/workflow/workflow-deployments", {
    method: "POST",
    body: formData,
  });
}
async function DeleteWorkflowDeployment(id) {
  return fetch(`/api/workflow/workflow-deployments/${id}`, { method: "DELETE" });
}

// User Tasks
async function GetUserTasks(user) {
  user = 'dapadi';
  return fetch(`/api/workflow/process/task/user/${encodeURIComponent(user)}`, { method: "GET" });
}

export default {
  GetActivities, CreateActivity, UpdateActivity, DeleteActivity,
  GetWorkflows, CreateWorkflow, UpdateWorkflow, DeleteWorkflow,
  GetWorkflowActivities, CreateWorkflowActivity, DeleteWorkflowActivity,
  UploadProcessDefinition,
  GetWorkflowDeployments, CreateWorkflowDeployment, DeleteWorkflowDeployment,
  GetUserTasks,
};
