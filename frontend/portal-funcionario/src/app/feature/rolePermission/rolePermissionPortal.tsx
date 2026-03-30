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
import RolePermServices from "@/app/api/permissionsManagementServices";
import UserServices from "@/app/api/userServices";
import "./rolePermissionPortal.css";

type Role = { id: string | number; name: string };
type Permission = { id: string; name: string; active?: boolean };
type RolePermission = { id: string; roleId: string; permissionId: string };

const ACCENT = "#8b5cf6";

export default function RolePermissionPortal() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [assignments, setAssignments] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedPermId, setSelectedPermId] = useState("");
  const [filterRoleId, setFilterRoleId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "warn" | "err" } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      UserServices.GetRolesProcess().then((r: Response) => r.json()).catch(() => ({ roles: [] })),
      RolePermServices.GetPermissions().then((r) => r.json()).catch(() => ({ permissions: [] })),
      RolePermServices.GetRolePermissions().then((r) => r.json()).catch(() => ({ rolePermissions: [] })),
    ]).then(([rolesData, permsData, assignData]) => {
      setRoles(Array.isArray(rolesData.roles) ? rolesData.roles : []);
      setPermissions(Array.isArray(permsData.permissions) ? permsData.permissions : []);
      setAssignments(Array.isArray(assignData.rolePermissions) ? assignData.rolePermissions : []);
    }).finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string, type: "ok" | "warn" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const roleName = (id: string) => roles.find((r) => String(r.id) === String(id))?.name ?? id;
  const permName = (id: string) => permissions.find((p) => p.id === id)?.name ?? id;

  const alreadyAssigned = assignments.some(
    (a) => String(a.roleId) === selectedRoleId && a.permissionId === selectedPermId
  );

  const handleAdd = async () => {
    if (!selectedRoleId || !selectedPermId || alreadyAssigned) return;
    setIsSaving(true);
    const payload = { roleId: selectedRoleId, permissionId: selectedPermId };
    try {
      const res = await RolePermServices.CreateRolePermission(payload);
      const optimistic: RolePermission = { id: String(Date.now()), ...payload };
      if (res.ok) {
        try {
          const created: RolePermission = await res.json();
          setAssignments((prev) => [...prev, created]);
        } catch {
          setAssignments((prev) => [...prev, optimistic]);
        }
      } else {
        setAssignments((prev) => [...prev, optimistic]);
      }
      showToast(`Assigned "${permName(selectedPermId)}" to "${roleName(selectedRoleId)}"`);
      setSelectedPermId("");
    } catch {
      const optimistic: RolePermission = { id: String(Date.now()), ...payload };
      setAssignments((prev) => [...prev, optimistic]);
      showToast(`Assigned "${permName(selectedPermId)}" to "${roleName(selectedRoleId)}"`);
      setSelectedPermId("");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (assignment: RolePermission) => {
    try {
      await RolePermServices.DeleteRolePermission(assignment.id);
    } catch {}
    finally {
      setAssignments((prev) => prev.filter((a) => a.id !== assignment.id));
      showToast(`Removed "${permName(assignment.permissionId)}" from "${roleName(assignment.roleId)}"`, "warn");
    }
  };

  const filtered = filterRoleId
    ? assignments.filter((a) => String(a.roleId) === filterRoleId)
    : assignments;

  // Permissions not yet assigned to the selected role
  const availablePerms = permissions.filter(
    (p) => !assignments.some((a) => String(a.roleId) === selectedRoleId && a.permissionId === p.id)
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
              Roles - Permisos
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

        <div className="rpp-root">
        {toast && (
          <div className={`rpp-toast ${toast.type}`}>
            {toast.type === "ok" ? "✓ " : "⚠ "}{toast.msg}
          </div>
        )}

        <div className="rpp-header">
          <div className="rpp-header-row">
            <div className="rpp-icon">🔗</div>
            <h1 className="rpp-title">Role Permissions</h1>
          </div>
          <p className="rpp-subtitle">Assign permissions to roles to control access across the system</p>
        </div>

        <div className="rpp-stats">
          {[
            { label: "Total Roles", value: roles.length, color: "#3ecfcf" },
            { label: "Total Permissions", value: permissions.length, color: "#f59e0b" },
            { label: "Assignments", value: assignments.length, color: ACCENT },
          ].map((s) => (
            <div key={s.label} className="rpp-stat">
              <div className="rpp-stat-val" style={{ color: s.color }}>{s.value}</div>
              <div className="rpp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Add assignment */}
        <div className="rpp-add-card">
          <div className="rpp-add-title">Assign Permission to Role</div>
          <div className="rpp-add-row">
            <div className="rpp-field">
              <label className="rpp-label">Role</label>
              <select
                className="rpp-select"
                value={selectedRoleId}
                onChange={(e) => { setSelectedRoleId(e.target.value); setSelectedPermId(""); }}
              >
                <option value="">Select a role…</option>
                {roles.map((r) => (
                  <option key={r.id} value={String(r.id)}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="rpp-field">
              <label className="rpp-label">Permission</label>
              <select
                className="rpp-select"
                value={selectedPermId}
                onChange={(e) => setSelectedPermId(e.target.value)}
                disabled={!selectedRoleId}
              >
                <option value="">Select a permission…</option>
                {(selectedRoleId ? availablePerms : permissions).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <button
              className="rpp-btn-add"
              onClick={handleAdd}
              disabled={!selectedRoleId || !selectedPermId || alreadyAssigned || isSaving}
            >
              {isSaving ? "Adding…" : "+ Add Assignment"}
            </button>
          </div>
          {alreadyAssigned && selectedRoleId && selectedPermId && (
            <div className="rpp-warn">⚠ This permission is already assigned to the selected role.</div>
          )}
        </div>

        {/* Filter + table */}
        <div className="rpp-filter-row">
          <span className="rpp-filter-label">Filter by role:</span>
          <select
            className="rpp-filter-select"
            value={filterRoleId}
            onChange={(e) => setFilterRoleId(e.target.value)}
          >
            <option value="">All roles</option>
            {roles.map((r) => (
              <option key={r.id} value={String(r.id)}>{r.name}</option>
            ))}
          </select>
        </div>

        <div className="rpp-table-wrap">
          <table className="rpp-table">
            <thead>
              <tr>
                {["Role", "Permission", "Action"].map((h) => (
                  <th key={h} className="rpp-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={3} className="rpp-td" style={{ padding: "8px 16px" }}>
                      <div className="rpp-skeleton" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={3} className="rpp-empty">No assignments found</td></tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="rpp-tr">
                    <td className="rpp-td">
                      <span className="rpp-role-tag">{roleName(a.roleId)}</span>
                    </td>
                    <td className="rpp-td">
                      <span className="rpp-perm-tag">{permName(a.permissionId)}</span>
                    </td>
                    <td className="rpp-td">
                      <button className="rpp-btn-remove" onClick={() => handleRemove(a)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="rpp-footer">Showing {filtered.length} of {assignments.length} assignments</p>
        </div>
      </div>
    </>
  );
}
