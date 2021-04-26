import React, { ReactChild, FunctionComponent, ComponentType } from 'react';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import error from '@material-ui/core/colors/deepOrange';
import success from '@material-ui/core/colors/green';
import { SnackbarProvider } from 'notistack';
import { StaticRouter, BrowserRouter, BrowserRouterProps } from 'react-router-dom';
import { StaticRouterProps } from 'react-router';
import { Header } from 'Components/Layouts';
import classes from './classes.sass';

const theme = createMuiTheme({
  palette: {
    error: error,
    success: success,
  }
});

const Layout: FunctionComponent<{
  serverSide:boolean,
  children: ReactChild|ReactChild[]
}> = ({ serverSide, children }) => {

  const Router: ComponentType<StaticRouterProps|BrowserRouterProps> = serverSide ? StaticRouter : BrowserRouter;

  return <ThemeProvider theme={theme}>
    <Router>
      {/* <Lang> */}
      <SnackbarProvider>
        <Header />
        <Container className={classes.page}>
          {children}
        </Container>
        {/* <Footer /> */}
      </SnackbarProvider>
      {/* </Lang> */}
    </Router>
    <div className={classes.background} />
  </ThemeProvider>;
};

export default Layout;
