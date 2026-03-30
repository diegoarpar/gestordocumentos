'use client'
import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockIcon from '@mui/icons-material/Lock';
import LinkIcon from '@mui/icons-material/Link';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';

export const DRAWER_WIDTH = 240;

export const adminSubItems = [
  { name: 'roles',              path: '/pages/role',               description: 'Roles',                   icon: AdminPanelSettingsIcon, color: '#6366f1' },
  { name: 'permissions',        path: '/pages/permission',         description: 'Permisos',                icon: LockIcon,               color: '#f59e0b' },
  { name: 'rolesPermissions',   path: '/pages/role-permission',    description: 'Roles - Permisos',        icon: LinkIcon,               color: '#10b981' },
  { name: 'userRoles',          path: '/pages/user-role',          description: 'Usuarios - Roles',        icon: PersonAddIcon,          color: '#ec4899' },
  { name: 'activities',         path: '/pages/activity',           description: 'Actividades',             icon: TaskAltIcon,            color: '#8b5cf6' },
  { name: 'workflows',          path: '/pages/workflow',           description: 'Workflows',               icon: AccountTreeIcon,        color: '#14b8a6' },
  { name: 'workflowActivities', path: '/pages/workflow-activity',  description: 'Workflows - Actividades', icon: DeviceHubIcon,          color: '#f97316' },
  { name: 'deployment',         path: '/pages/workflow-deployment', description: 'Despliegues',            icon: RocketLaunchIcon,       color: '#ef4444' },
];

export const otherItems = [
  { name: 'workflowStarter', path: '/pages/workflow-starter', description: 'Iniciar Proceso', icon: PlayCircleIcon,  color: '#22c55e' },
  { name: 'task',            path: '/pages/task',             description: 'Mis Tareas',       icon: AssignmentIcon, color: '#3b82f6' },
];

export const allMenuItems = [...adminSubItems, ...otherItems];

const itemBtnSx = {
  borderRadius: 1,
  mx: 1,
  '&:hover': { bgcolor: '#334155' },
};

function AppMenu({ sidebarOpen, setSidebarOpen }) {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: '#1e293b',
          color: '#e2e8f0',
          borderRight: '1px solid #334155',
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          borderBottom: '1px solid #334155',
          minHeight: '64px !important',
        }}
      >
        <IconButton onClick={() => setSidebarOpen(false)} sx={{ color: '#94a3b8', '&:hover': { bgcolor: '#334155' } }}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Box sx={{ overflow: 'auto', mt: 1 }}>

        {/* Administration section */}
        <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>
          Administración
        </Typography>
        <List dense>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setAdminOpen(o => !o)} sx={itemBtnSx}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <AdminPanelSettingsIcon sx={{ fontSize: 20, color: '#6366f1' }} />
              </ListItemIcon>
              <ListItemText primary="Administración" primaryTypographyProps={{ fontSize: 13, color: '#cbd5e1' }} />
              {adminOpen
                ? <ExpandLess sx={{ color: '#64748b', fontSize: 18 }} />
                : <ExpandMore sx={{ color: '#64748b', fontSize: 18 }} />}
            </ListItemButton>
          </ListItem>

          <Collapse in={adminOpen} timeout="auto" unmountOnExit>
            <List dense disablePadding>
              {adminSubItems.map((item) => {
                const Icon = item.icon;
                return (
                  <ListItem key={item.name} disablePadding>
                    <ListItemButton component="a" href={item.path} sx={{ ...itemBtnSx, pl: 3 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Icon sx={{ fontSize: 18, color: item.color }} />
                      </ListItemIcon>
                      <ListItemText primary={item.description} primaryTypographyProps={{ fontSize: 12, color: '#94a3b8' }} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </List>

        <Divider sx={{ borderColor: '#334155', mx: 2, my: 1 }} />

        {/* Processes section */}
        <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>
          Procesos
        </Typography>
        <List dense>
          {otherItems.map((item) => {
            const Icon = item.icon;
            return (
              <ListItem key={item.name} disablePadding>
                <ListItemButton component="a" href={item.path} sx={itemBtnSx}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon sx={{ fontSize: 20, color: item.color }} />
                  </ListItemIcon>
                  <ListItemText primary={item.description} primaryTypographyProps={{ fontSize: 13, color: '#cbd5e1' }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

      </Box>
    </Drawer>
  );
}

export default AppMenu;
