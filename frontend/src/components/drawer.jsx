import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Outlet, useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/contextApi';
import { toast } from 'react-toastify';
import { logoutApi } from '../services/auth.service';

const drawerWidth = 240;

/* ✅ FIXED Main component */
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    width: '100%',
    overflowX: 'hidden',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: open ? 0 : `-${drawerWidth}px`,
  }),
);

/* ✅ FIXED AppBar */
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function PersistentDrawerLeft({
  title = 'Dashboard',
  children,
  data = [],
  navUser,
}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { setUser, setIslogin, islogin } = useApi();

  const handleLogout = async () => {
    try {
      const res = await logoutApi();
      if (res) {
        localStorage.clear();
        setUser({
          id: '',
          name: '',
          email: '',
          accountType: '',
          isblock: false,
        });
        setIslogin(false);
        toast.success(res.message || 'Logout successful');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Logout failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100vw', overflowX: 'hidden' }}>
      <CssBaseline />

      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen(true)}
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap>
            {title}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {islogin ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                className="ml-4 text-gray-200 hover:text-white"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="ml-4 text-gray-200 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : null}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            minWidth: drawerWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/${navUser}`)}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          {data.map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => navigate(`/${navUser}/${text}`)}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Main className="w-full max-w-full bg-gray-50 overflow-x-hidden" open={open}>
    
    
          {children || <Outlet />}
  
      </Main>
    </Box>
  );
}
