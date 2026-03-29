'use client'
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupsIcon from '@mui/icons-material/Groups';
import LockIcon from '@mui/icons-material/Lock';
import LinkIcon from '@mui/icons-material/Link';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TaskInformation from './tasksInformation';

const DRAWER_WIDTH = 240;

const menuItems = [
  { name: 'roles',               path: '/pages/role',                description: 'Roles',                  icon: AdminPanelSettingsIcon, color: '#6366f1' },
  { name: 'groups',              path: '/pages/group',               description: 'Grupos',                 icon: GroupsIcon,             color: '#0ea5e9' },
  { name: 'permissions',         path: '/pages/permission',          description: 'Permisos',               icon: LockIcon,               color: '#f59e0b' },
  { name: 'rolePermissions',     path: '/pages/role-permission',     description: 'Roles - Permisos',       icon: LinkIcon,               color: '#10b981' },
  { name: 'userGroups',          path: '/pages/user-group',          description: 'Usuarios - Grupos',      icon: PersonAddIcon,          color: '#ec4899' },
  { name: 'activities',          path: '/pages/activity',            description: 'Actividades',            icon: TaskAltIcon,            color: '#8b5cf6' },
  { name: 'workflows',           path: '/pages/workflow',            description: 'Workflows',              icon: AccountTreeIcon,        color: '#14b8a6' },
  { name: 'workflowActivities',  path: '/pages/workflow-activity',   description: 'Workflow - Actividades', icon: DeviceHubIcon,          color: '#f97316' },
  { name: 'workflowDeployments', path: '/pages/workflow-deployment', description: 'Despliegues',            icon: RocketLaunchIcon,       color: '#ef4444' },
  { name: 'workflowStarter',     path: '/pages/workflow-starter',    description: 'Iniciar Proceso',        icon: PlayCircleIcon,         color: '#22c55e' },
  { name: 'task',                path: '/pages/task',                description: 'Mis Tareas',             icon: AssignmentIcon,         color: '#3b82f6' },
];

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: open ? DRAWER_WIDTH : 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const Portal = () => {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [contTramites, setContTramites] = useState(0);
  const handleContTramites = () => setContTramites(c => c + 1);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f1f5f9' }}>

      {/* Top AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#1e293b',
          borderBottom: '1px solid #334155',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(o => !o)}
            sx={{ mr: 2 }}
          >
            {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <DashboardIcon sx={{ mr: 1, color: '#60a5fa' }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 0.5 }}>
            Portal del Funcionario
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={() => router.push('../../')}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              border: '1px solid #475569',
              '&:hover': { bgcolor: '#334155' },
            }}
          >
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
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
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 1 }}>
          <Typography
            variant="caption"
            sx={{ px: 2, py: 1, display: 'block', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}
          >
            Navegación
          </Typography>
          <List dense>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <ListItem key={item.name} disablePadding>
                  <ListItemButton
                    component="a"
                    href={item.path}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&:hover': { bgcolor: '#334155' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Icon sx={{ fontSize: 20, color: item.color }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.description}
                      primaryTypographyProps={{ fontSize: 13, color: '#cbd5e1' }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Main open={drawerOpen}>
        <Toolbar />

        {/* Dashboard section heading */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={700} color="#1e293b">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Accede rápidamente a los módulos del sistema
          </Typography>
        </Box>

        {/* Menu cards grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 2,
            mb: 4,
          }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.name}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                  },
                }}
              >
                <CardActionArea component="a" href={item.path} sx={{ p: 2, height: '100%' }}>
                  <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: item.color + '1a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.5,
                      }}
                    >
                      <Icon sx={{ fontSize: 26, color: item.color }} />
                    </Box>
                    <Typography variant="body2" fontWeight={600} color="#1e293b" lineHeight={1.3}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>

        {/* Tasks section */}
        <Box
          sx={{
            bgcolor: '#fff',
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight={700} color="#1e293b">
              Tareas Pendientes
            </Typography>
            <Chip label="Lista" size="small" sx={{ ml: 'auto', bgcolor: '#eff6ff', color: '#3b82f6', fontWeight: 600 }} />
          </Box>
          <Box sx={{ p: 2 }}>
            <TaskInformation
              contTramites={contTramites}
              handleContTramites={handleContTramites}
            />
          </Box>
        </Box>
      </Main>
    </Box>
  );
};

export default Portal;
