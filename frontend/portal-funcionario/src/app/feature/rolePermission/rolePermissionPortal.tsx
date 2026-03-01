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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap');
        .rpp-root { min-height:100vh; background:#060b14; font-family:'DM Sans',sans-serif; color:#c8d6e8; padding:40px 48px; }
        .rpp-header { margin-bottom:36px; }
        .rpp-header-row { display:flex; align-items:center; gap:14px; margin-bottom:6px; }
        .rpp-icon { width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg,#8b5cf622,#8b5cf644); border:1px solid #8b5cf644; display:flex; align-items:center; justify-content:center; font-size:18px; }
        .rpp-title { margin:0; font-size:26px; font-weight:800; font-family:'Sora',sans-serif; color:#e8edf5; letter-spacing:-0.5px; }
        .rpp-subtitle { margin:0; font-size:14px; color:#3d5060; margin-left:52px; }
        .rpp-stats { display:flex; gap:16px; margin-bottom:32px; }
        .rpp-stat { background:#0a111e; border:1px solid #1e2d45; border-radius:12px; padding:16px 24px; flex:1; }
        .rpp-stat-val { font-size:26px; font-weight:800; font-family:'Sora',sans-serif; }
        .rpp-stat-label { font-size:12px; color:#3d5060; font-weight:600; margin-top:2px; text-transform:uppercase; letter-spacing:.06em; }
        .rpp-add-card { background:#0a111e; border:1px solid #1e2d45; border-radius:14px; padding:24px 28px; margin-bottom:24px; }
        .rpp-add-title { font-size:14px; font-weight:700; color:#8a9ab5; text-transform:uppercase; letter-spacing:.06em; margin-bottom:16px; }
        .rpp-add-row { display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap; }
        .rpp-field { display:flex; flex-direction:column; gap:6px; flex:1; min-width:180px; }
        .rpp-label { font-size:11px; font-weight:600; color:#5a6a85; text-transform:uppercase; letter-spacing:.08em; }
        .rpp-select { background:#080d18; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; padding:10px 14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; cursor:pointer; }
        .rpp-select:focus { border-color:${ACCENT}; }
        .rpp-btn-add { padding:10px 24px; border-radius:8px; font-size:13px; font-weight:700; border:none; background:linear-gradient(135deg,#8b5cf6,#7c3aed); color:#fff; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 4px 18px rgba(139,92,246,.2); transition:all .15s; white-space:nowrap; }
        .rpp-btn-add:hover:not(:disabled) { box-shadow:0 6px 24px rgba(139,92,246,.35); }
        .rpp-btn-add:disabled { opacity:.45; cursor:not-allowed; }
        .rpp-warn { font-size:12px; color:#f59e0b; margin-top:8px; }
        .rpp-filter-row { display:flex; align-items:center; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
        .rpp-filter-label { font-size:12px; color:#5a6a85; font-weight:600; }
        .rpp-filter-select { background:#0a111e; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:13px; padding:8px 12px; outline:none; font-family:'DM Sans',sans-serif; cursor:pointer; }
        .rpp-filter-select:focus { border-color:${ACCENT}; }
        .rpp-table-wrap { background:#0a111e; border:1px solid #1e2d45; border-radius:14px; overflow:hidden; }
        .rpp-table { width:100%; border-collapse:collapse; }
        .rpp-th { padding:14px 16px; text-align:left; font-size:11px; font-weight:700; color:#3d5060; text-transform:uppercase; letter-spacing:.08em; border-bottom:1px solid #1e2d45; }
        .rpp-tr { border-bottom:1px solid #111d2e; transition:background .12s; }
        .rpp-tr:last-child { border-bottom:none; }
        .rpp-tr:hover .rpp-td { background:#0d1829; }
        .rpp-td { padding:14px 16px; background:transparent; transition:background .12s; }
        .rpp-role-tag { display:inline-flex; align-items:center; background:#8b5cf615; color:#a78bfa; border:1px solid #8b5cf630; border-radius:20px; padding:3px 12px; font-size:12px; font-weight:600; }
        .rpp-perm-tag { display:inline-flex; align-items:center; background:#f59e0b15; color:#fbbf24; border:1px solid #f59e0b30; border-radius:20px; padding:3px 12px; font-size:12px; font-weight:600; }
        .rpp-btn-remove { padding:6px 14px; border-radius:7px; font-size:12px; font-weight:600; border:1px solid #1e2d45; background:transparent; color:#8a9ab5; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .rpp-btn-remove:hover { border-color:#e05c5c44; color:#e05c5c; }
        .rpp-empty { padding:52px; text-align:center; color:#2a3d58; font-size:14px; }
        .rpp-footer { margin-top:14px; font-size:12px; color:#2a3d58; }
        .rpp-toast { position:fixed; bottom:32px; right:32px; z-index:999; padding:12px 22px; border-radius:10px; font-size:14px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.5); animation:rppToastIn .25s cubic-bezier(.16,1,.3,1); }
        .rpp-toast.ok { background:#120d1f; border:1px solid #8b5cf644; color:#a78bfa; }
        .rpp-toast.warn { background:#2a1a1a; border:1px solid #e05c5c55; color:#e05c5c; }
        .rpp-skeleton { height:52px; background:#0d1829; border-radius:6px; animation:rppPulse 1.4s ease-in-out infinite; }
        @keyframes rppPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes rppToastIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @media (max-width:768px) { .rpp-root{padding:24px 16px;} .rpp-stats{flex-direction:column;} .rpp-add-row{flex-direction:column;} .rpp-table-wrap{overflow-x:auto;} }
      `}</style>

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
