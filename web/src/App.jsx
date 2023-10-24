//imports
import React, { useState, lazy, useEffect } from "react";

//material ui
import { Box } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

//third party
import { useSelector } from 'react-redux';
import { SnackbarProvider } from 'notistack'

// routing
import Routes from './routes';

// defaultTheme
import themes from './themes';
import { ThemeProvider } from '@mui/material/styles';

// project imports
import NavigationScroll from '@app/layout/NavigationScroll';
import Loadable from '@app/themes/ui-component/Loadable';

//services
import * as AuthService from "@app/services/auth.service";
import ChapterQueueDrawer from "./components/ChapterQueueDrawer";


const Login = Loadable(lazy(() => import('@app/pages/authentication/authentication/Login')));

export default function App() {
  const auth = useSelector(state => state.auth);
  const [initializing, setInitializing] = useState(true);

  const verifyToken = async () => {
    AuthService.verify().then(() => {
      AuthService.me();
    }).catch(() => {
    }).finally(() => {
      setInitializing(false);
    })
  }

  useEffect(() => {
    verifyToken();
  }, []);


  const customization = useSelector((state) => state.customization);
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ThemeProvider theme={themes(customization)}>
        <NavigationScroll>
          {
            (initializing) ? (
              <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
                <Box>
                  Loading....
                </Box>
              </Box>
            ) : (
              <React.Fragment>
                {
                  auth.accessToken ? (
                    <Routes />
                  ) : (
                    <Login />
                  )
                }
                <ChapterQueueDrawer />
              </React.Fragment>

            )
          }
          <SnackbarProvider anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }} />
        </NavigationScroll>
      </ThemeProvider>
    </LocalizationProvider >
  )
}
