import React from 'react';
import Grid from '@material-ui/core/Grid';

import Scene from 'Components/Three/Scene';
import Menu from 'Components/Three/Menu';

import './classes.sass';

export default () => <Grid alignItems='center' container direction='column' justify='center'>
  <Menu />
  <Scene />
</Grid>;
