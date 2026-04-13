// Groups
async function GetGroups() {
  return fetch("/api/workflow/groups", { method: "GET", credentials: 'include' });
}
async function CreateGroup(data) {
  return fetch("/api/workflow/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: 'include',
  });
}
async function UpdateGroup(id, data) {
  return fetch(`/api/workflow/groups/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: 'include',
  });
}
async function DeleteGroup(id) {
  return fetch(`/api/workflow/groups/${id}`, { method: "DELETE", credentials: 'include' });
}

// Permissions
async function GetPermissions() {
  return fetch("/api/workflow/permissions", { method: "GET", credentials: 'include' });
}
async function CreatePermission(data) {
  return fetch("/api/workflow/permissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: 'include',
  });
}
async function UpdatePermission(id, data) {
  return fetch(`/api/workflow/permissions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: 'include',
  });
}
async function DeletePermission(id) {
  return fetch(`/api/workflow/permissions/${id}`, { method: "DELETE", credentials: 'include' });
}

// Role-Permissions
async function GetRolePermissions() {
  return fetch("/api/workflow/role-permissions", { method: "GET", credentials: 'include' });
}
async function CreateRolePermission(data) {
  return fetch("/api/workflow/role-permissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: 'include',
  });
}
async function DeleteRolePermission(id) {
  return fetch(`/api/workflow/role-permissions/${id}`, { method: "DELETE", credentials: 'include' });
}

// User-Groups
async function GetUserGroups() {
  return fetch("/api/workflow/user-groups", { method: "GET", credentials: 'include' });
}
async function CreateUserGroup(data) {
  return fetch("/api/workflow/user-groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: 'include',
  });
}
async function DeleteUserGroup(id) {
  return fetch(`/api/workflow/user-groups/${id}`, { method: "DELETE", credentials: 'include' });
}

export default {
  GetGroups, CreateGroup, UpdateGroup, DeleteGroup,
  GetPermissions, CreatePermission, UpdatePermission, DeletePermission,
  GetRolePermissions, CreateRolePermission, DeleteRolePermission,
  GetUserGroups, CreateUserGroup, DeleteUserGroup,
};
