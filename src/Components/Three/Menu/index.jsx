import React, { useState, useRef, useEffect } from 'react';

import { REGEX_LABELS_HANDLED } from 'helpers/constans/parser';

import Fab from '@material-ui/core/Fab';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
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
    const formatted = labels.asmap((elem) => elem.ascase('upper').replace(/[’2]/, '\''));
    return formatted.asfilter((label) => REGEX_LABELS_HANDLED.test(label));
  };

  const applyMix = () => {

  };

  const resetMix = () => {

  };

  return <div className={classes.menuContainer}>
    <Fab className={classes.menuButton} color='primary' onClick={() => toggleOpen()} ref={button}><AppsIcon /></Fab>
    <Popover
      action={popover}
      anchorEl={button.current}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      className={classes.popover}
      classes={{ paper: classes.menu }}
      open={Boolean(button.current)}
      style={{ display: open ? 'initial' : 'none' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <LabelTextField
        className={classes.labelField}
        classes={{ title: classes.labelFieldTitle }}
        labelsChange={labelsChangeHandler}
        placeholder={'cube:menu.mix.placeholder'.asconvert('translate')}
        title={'cube:menu.mix.title'.asconvert('translate')}
      />
      <div className={classes.mixButtons}>
        <Button
          children={'cube:menu.mix.apply'.asconvert('translate')}
          className={classes.mixButton}
          color='primary'
          onClick={applyMix}
          variant='contained'
        />
        <Button
          children={'cube:menu.mix.reset'.asconvert('translate')}
          className={classes.mixButton}
          color='secondary'
          onClick={resetMix}
          variant='contained'
        />
      </div>
    </Popover>
  </div>;
};

export default Menu;
