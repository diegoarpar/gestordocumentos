'use client'
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AppMenu, { allMenuItems, DRAWER_WIDTH } from '../menus/menu';
import TaskInformation from './tasksInformation';

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

      {/* Sidebar */}
      <AppMenu sidebarOpen={drawerOpen} setSidebarOpen={setDrawerOpen} />

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
          {allMenuItems.map((item) => {
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
      </Main>
    </Box>
  );
};

export default Portal;
