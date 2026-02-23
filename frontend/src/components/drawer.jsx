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

/* ✅ FIXED Main (Scrollable area) */
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    width: '100%',
    height: '100vh',              // 🔥 fixed height
    overflowY: 'auto',            // 🔥 scrolling here
    overflowX: 'hidden',
    display:'flex',
    flexDirection:'column',
    justifyContent:'between',
    position:'relative',
    alignItems:'center',
    marginLeft: open ? `${drawerWidth}px` : 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: '#f9fafb',
  }),
);

/* ✅ FIXED AppBar */
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width']),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
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
  const [sideBar ,setSideBar] = React.useState(true);
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
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
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

          {islogin && (
            <>
              <button
                onClick={() => navigate(`/${navUser}/profile`)}
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
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        open={open}
        
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            overflow: 'hidden', // 🔥 drawer doesn’t scroll page
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/${navUser}`)}>
              <ListItemIcon><InboxIcon /></ListItemIcon>
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

      <Main open={open}>
        
        {children || <Outlet />}
      </Main>
    </Box>
  );
}
