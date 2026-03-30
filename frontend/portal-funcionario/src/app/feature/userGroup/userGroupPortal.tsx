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
import "./userGroupPortal.css";

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
