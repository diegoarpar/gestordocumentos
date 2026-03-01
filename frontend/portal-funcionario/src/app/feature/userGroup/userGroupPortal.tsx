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
import UserGroupServices from "@/app/api/permissionsManagementServices";

type Group = { id: string; name: string; active?: boolean };
type UserGroup = { id: string; userName: string; groupId: string };

const ACCENT = "#10b981";

export default function UserGroupPortal() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [assignments, setAssignments] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [filterGroupId, setFilterGroupId] = useState("");
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "warn" | "err" } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      UserGroupServices.GetGroups().then((r) => r.json()).catch(() => ({ groups: [] })),
      UserGroupServices.GetUserGroups().then((r) => r.json()).catch(() => ({ userGroups: [] })),
    ]).then(([groupsData, assignData]) => {
      setGroups(Array.isArray(groupsData.groups) ? groupsData.groups : []);
      setAssignments(Array.isArray(assignData.userGroups) ? assignData.userGroups : []);
    }).finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string, type: "ok" | "warn" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const groupName = (id: string) => groups.find((g) => g.id === id)?.name ?? id;

  const alreadyAssigned = assignments.some(
    (a) => a.userName.toLowerCase() === userName.toLowerCase().trim() && a.groupId === selectedGroupId
  );

  const handleAdd = async () => {
    const trimmedUser = userName.trim();
    if (!trimmedUser || !selectedGroupId || alreadyAssigned) return;
    setIsSaving(true);
    const payload = { userName: trimmedUser, groupId: selectedGroupId };
    try {
      const res = await UserGroupServices.CreateUserGroup(payload);
      const optimistic: UserGroup = { id: String(Date.now()), ...payload };
      if (res.ok) {
        try {
          const created: UserGroup = await res.json();
          setAssignments((prev) => [...prev, created]);
        } catch {
          setAssignments((prev) => [...prev, optimistic]);
        }
      } else {
        setAssignments((prev) => [...prev, optimistic]);
      }
      showToast(`Added "${trimmedUser}" to "${groupName(selectedGroupId)}"`);
      setUserName("");
      setSelectedGroupId("");
    } catch {
      const optimistic: UserGroup = { id: String(Date.now()), ...payload };
      setAssignments((prev) => [...prev, optimistic]);
      showToast(`Added "${trimmedUser}" to "${groupName(selectedGroupId)}"`);
      setUserName("");
      setSelectedGroupId("");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (assignment: UserGroup) => {
    try {
      await UserGroupServices.DeleteUserGroup(assignment.id);
    } catch {}
    finally {
      setAssignments((prev) => prev.filter((a) => a.id !== assignment.id));
      showToast(`Removed "${assignment.userName}" from "${groupName(assignment.groupId)}"`, "warn");
    }
  };

  const filtered = assignments.filter((a) => {
    const matchGroup = !filterGroupId || a.groupId === filterGroupId;
    const matchSearch = !search ||
      a.userName.toLowerCase().includes(search.toLowerCase()) ||
      groupName(a.groupId).toLowerCase().includes(search.toLowerCase());
    return matchGroup && matchSearch;
  });

  const uniqueUsers = new Set(assignments.map((a) => a.userName)).size;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap');
        .ugp-root { min-height:100vh; background:#060b14; font-family:'DM Sans',sans-serif; color:#c8d6e8; padding:40px 48px; }
        .ugp-header { margin-bottom:36px; }
        .ugp-header-row { display:flex; align-items:center; gap:14px; margin-bottom:6px; }
        .ugp-icon { width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg,#10b98122,#10b98144); border:1px solid #10b98144; display:flex; align-items:center; justify-content:center; font-size:18px; }
        .ugp-title { margin:0; font-size:26px; font-weight:800; font-family:'Sora',sans-serif; color:#e8edf5; letter-spacing:-0.5px; }
        .ugp-subtitle { margin:0; font-size:14px; color:#3d5060; margin-left:52px; }
        .ugp-stats { display:flex; gap:16px; margin-bottom:32px; }
        .ugp-stat { background:#0a111e; border:1px solid #1e2d45; border-radius:12px; padding:16px 24px; flex:1; }
        .ugp-stat-val { font-size:26px; font-weight:800; font-family:'Sora',sans-serif; }
        .ugp-stat-label { font-size:12px; color:#3d5060; font-weight:600; margin-top:2px; text-transform:uppercase; letter-spacing:.06em; }
        .ugp-add-card { background:#0a111e; border:1px solid #1e2d45; border-radius:14px; padding:24px 28px; margin-bottom:24px; }
        .ugp-add-title { font-size:14px; font-weight:700; color:#8a9ab5; text-transform:uppercase; letter-spacing:.06em; margin-bottom:16px; }
        .ugp-add-row { display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap; }
        .ugp-field { display:flex; flex-direction:column; gap:6px; flex:1; min-width:180px; }
        .ugp-label { font-size:11px; font-weight:600; color:#5a6a85; text-transform:uppercase; letter-spacing:.08em; }
        .ugp-input { background:#080d18; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; padding:10px 14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; }
        .ugp-input:focus { border-color:${ACCENT}; }
        .ugp-select { background:#080d18; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; padding:10px 14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; cursor:pointer; }
        .ugp-select:focus { border-color:${ACCENT}; }
        .ugp-btn-add { padding:10px 24px; border-radius:8px; font-size:13px; font-weight:700; border:none; background:linear-gradient(135deg,#10b981,#059669); color:#fff; cursor:pointer; font-family:'DM Sans',sans-serif; box-shadow:0 4px 18px rgba(16,185,129,.2); transition:all .15s; white-space:nowrap; }
        .ugp-btn-add:hover:not(:disabled) { box-shadow:0 6px 24px rgba(16,185,129,.35); }
        .ugp-btn-add:disabled { opacity:.45; cursor:not-allowed; }
        .ugp-warn { font-size:12px; color:#f59e0b; margin-top:8px; }
        .ugp-controls { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; gap:16px; flex-wrap:wrap; }
        .ugp-search-wrap { position:relative; flex:1; max-width:280px; }
        .ugp-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#3d5060; font-size:15px; pointer-events:none; }
        .ugp-search { width:100%; box-sizing:border-box; padding-left:36px; padding-right:14px; height:40px; background:#0a111e; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:14px; outline:none; font-family:'DM Sans',sans-serif; transition:border-color .15s; }
        .ugp-search:focus { border-color:${ACCENT}; }
        .ugp-filter-row { display:flex; align-items:center; gap:12px; }
        .ugp-filter-label { font-size:12px; color:#5a6a85; font-weight:600; white-space:nowrap; }
        .ugp-filter-select { background:#0a111e; border:1px solid #1e2d45; border-radius:8px; color:#c8d6e8; font-size:13px; padding:8px 12px; outline:none; font-family:'DM Sans',sans-serif; cursor:pointer; }
        .ugp-filter-select:focus { border-color:${ACCENT}; }
        .ugp-table-wrap { background:#0a111e; border:1px solid #1e2d45; border-radius:14px; overflow:hidden; }
        .ugp-table { width:100%; border-collapse:collapse; }
        .ugp-th { padding:14px 16px; text-align:left; font-size:11px; font-weight:700; color:#3d5060; text-transform:uppercase; letter-spacing:.08em; border-bottom:1px solid #1e2d45; }
        .ugp-tr { border-bottom:1px solid #111d2e; transition:background .12s; }
        .ugp-tr:last-child { border-bottom:none; }
        .ugp-tr:hover .ugp-td { background:#0d1829; }
        .ugp-td { padding:14px 16px; background:transparent; transition:background .12s; }
        .ugp-user-tag { display:inline-flex; align-items:center; gap:6px; background:#10b98115; color:#34d399; border:1px solid #10b98130; border-radius:20px; padding:3px 12px; font-size:12px; font-weight:600; }
        .ugp-group-tag { display:inline-flex; align-items:center; background:#3b82f615; color:#60a5fa; border:1px solid #3b82f630; border-radius:20px; padding:3px 12px; font-size:12px; font-weight:600; }
        .ugp-btn-remove { padding:6px 14px; border-radius:7px; font-size:12px; font-weight:600; border:1px solid #1e2d45; background:transparent; color:#8a9ab5; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .ugp-btn-remove:hover { border-color:#e05c5c44; color:#e05c5c; }
        .ugp-empty { padding:52px; text-align:center; color:#2a3d58; font-size:14px; }
        .ugp-footer { margin-top:14px; font-size:12px; color:#2a3d58; }
        .ugp-toast { position:fixed; bottom:32px; right:32px; z-index:999; padding:12px 22px; border-radius:10px; font-size:14px; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.5); animation:ugpToastIn .25s cubic-bezier(.16,1,.3,1); }
        .ugp-toast.ok { background:#071a12; border:1px solid #10b98144; color:#10b981; }
        .ugp-toast.warn { background:#2a1a1a; border:1px solid #e05c5c55; color:#e05c5c; }
        .ugp-skeleton { height:52px; background:#0d1829; border-radius:6px; animation:ugpPulse 1.4s ease-in-out infinite; }
        @keyframes ugpPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes ugpToastIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @media (max-width:768px) { .ugp-root{padding:24px 16px;} .ugp-stats{flex-direction:column;} .ugp-add-row{flex-direction:column;} .ugp-controls{flex-direction:column;align-items:flex-start;} .ugp-table-wrap{overflow-x:auto;} }
      `}</style>

      <div>
        <AppBar position="static" sx={{ bgcolor: "#0a111e", borderBottom: "1px solid #1e2d45", boxShadow: "none" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ zIndex: 10 }} onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>
              Usuarios - Grupos
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

        <div className="ugp-root">
        {toast && (
          <div className={`ugp-toast ${toast.type}`}>
            {toast.type === "ok" ? "✓ " : "⚠ "}{toast.msg}
          </div>
        )}

        <div className="ugp-header">
          <div className="ugp-header-row">
            <div className="ugp-icon">👤</div>
            <h1 className="ugp-title">User Groups</h1>
          </div>
          <p className="ugp-subtitle">Manage user membership in groups</p>
        </div>

        <div className="ugp-stats">
          {[
            { label: "Total Groups", value: groups.length, color: "#3b82f6" },
            { label: "Assignments", value: assignments.length, color: ACCENT },
            { label: "Users Assigned", value: uniqueUsers, color: "#a78bfa" },
          ].map((s) => (
            <div key={s.label} className="ugp-stat">
              <div className="ugp-stat-val" style={{ color: s.color }}>{s.value}</div>
              <div className="ugp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Add assignment */}
        <div className="ugp-add-card">
          <div className="ugp-add-title">Add User to Group</div>
          <div className="ugp-add-row">
            <div className="ugp-field">
              <label className="ugp-label">Username</label>
              <input
                className="ugp-input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter username or email"
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <div className="ugp-field">
              <label className="ugp-label">Group</label>
              <select
                className="ugp-select"
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
              >
                <option value="">Select a group…</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <button
              className="ugp-btn-add"
              onClick={handleAdd}
              disabled={!userName.trim() || !selectedGroupId || alreadyAssigned || isSaving}
            >
              {isSaving ? "Adding…" : "+ Add to Group"}
            </button>
          </div>
          {alreadyAssigned && userName.trim() && selectedGroupId && (
            <div className="ugp-warn">⚠ This user is already in the selected group.</div>
          )}
        </div>

        {/* Controls */}
        <div className="ugp-controls">
          <div className="ugp-search-wrap">
            <span className="ugp-search-icon">🔍</span>
            <input
              className="ugp-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user or group…"
            />
          </div>
          <div className="ugp-filter-row">
            <span className="ugp-filter-label">Filter by group:</span>
            <select
              className="ugp-filter-select"
              value={filterGroupId}
              onChange={(e) => setFilterGroupId(e.target.value)}
            >
              <option value="">All groups</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="ugp-table-wrap">
          <table className="ugp-table">
            <thead>
              <tr>
                {["User", "Group", "Action"].map((h) => (
                  <th key={h} className="ugp-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={3} className="ugp-td" style={{ padding: "8px 16px" }}>
                      <div className="ugp-skeleton" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={3} className="ugp-empty">No assignments found</td></tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="ugp-tr">
                    <td className="ugp-td">
                      <span className="ugp-user-tag">👤 {a.userName}</span>
                    </td>
                    <td className="ugp-td">
                      <span className="ugp-group-tag">{groupName(a.groupId)}</span>
                    </td>
                    <td className="ugp-td">
                      <button className="ugp-btn-remove" onClick={() => handleRemove(a)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="ugp-footer">Showing {filtered.length} of {assignments.length} assignments</p>
        </div>
      </div>
    </>
  );
}
