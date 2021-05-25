import React, { useState, useRef, useEffect } from 'react';

import { REGEX_LABELS_HANDLED } from 'helpers/constans/parser';

import Fab from '@material-ui/core/Fab';
import Popover from '@material-ui/core/Popover';
import LabelTextField from 'Components/Inputs/LabelTextField';

import AppsIcon from '@material-ui/icons/Apps';

import classes from './classes.sass';

const Menu = () => {
  const [ open, setOpen ] = useState(false);
  const button = useRef(null);
  const popover = useRef();

  const toggleOpen = (value = !open) => {
    console.log(value);
    setOpen(value);
  };

  useEffect(() => {
    console.log('EFFECT');
  });

  const labelsChangeHandler = (labels) => {
    const formatted = labels.asmap((elem) => elem.ascase('upper'));
    return formatted.asfilter((label) => REGEX_LABELS_HANDLED.test(label));
  };

  return <div className={classes.menuContainer}>
    <Fab className={classes.menuButton} color='primary' onClick={() => toggleOpen()} ref={button}><AppsIcon /></Fab>
    <Popover
      action={popover}
      anchorEl={button.current}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      className={classes.popover}
      classes={{ paper: classes.menu }}
      open={Boolean(button.current)}
      style={{ display: open ? 'initial' : 'none' }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}>
      <LabelTextField
        className={classes.labelField}
        classes={{ title: classes.labelFieldTitle }}
        labelsChange={labelsChangeHandler}
        title='Cube Mix'
      />
    </Popover>
  </div>;
};

export default Menu;
