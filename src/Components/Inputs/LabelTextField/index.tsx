import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  ChangeEventHandler,
  forwardRef,
  Ref,
} from 'react';

import useKeyPress from 'Hooks/useKeyPress';

import Input, { InputProps } from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';

import classes from './classes.sass';

interface IState {
  labels: string[];
  value: string;
}

interface ILabelTextFieldProps extends InputProps {
  labelsChange?: (labels: string[]) => string[];
  classes?: {
    field?: string,
    input?: string,
    label?: string
    labels?: string,
    title?: string,
  };
}

interface ILabelTextFieldRef {
  labels: string[];
}

const defaultState: IState = {
  labels: [],
  value: '',
};

const LabelTextField = (
  { labelsChange, classes: outerClasses, ...props }: ILabelTextFieldProps,
  ref: Ref<ILabelTextFieldRef>
) => {

  useImperativeHandle(ref, () => ({
    labels: state.labels
  }));

  const [ state, setState ] = useState<IState>(defaultState);
  const [ focused, setFocused ] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const inputChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const valueList = event.target.value.split(/\s/);
    const value = valueList.pop() || '';
    const newLabels = valueList.asfilter((value: string) => value) as string[];
    const labels = newLabels.length ? [ ...state.labels, ...newLabels ] : state.labels;
    setState({
      ...state,
      labels,
      value
    });
  };

  const removeLabel = (index: number) => {
    const labels = [...state.labels];
    labels.splice(index, 1);
    setState({
      ...state,
      labels,
    });
  };

  useEffect(() => {
    if (!labelsChange) return;
    const newLabels = labelsChange(state.labels);
    if (!newLabels.ascheck('equal', state.labels))
      setState({ ...state, labels: newLabels });
  }, [ state.labels, labelsChange ]);

  useKeyPress('Backspace', () => {
    if (!focused || !state.labels.length || state.value.length) return;
    removeLabel(state.labels.length - 1);
  });

  return <div className={[ classes.container, props.className ].join(' ')} onClick={() => input.current?.focus()}>
    <label className={[ classes.title, outerClasses?.asget('title') ]. join(' ')}>{props.title}</label>
    <Paper className={[ classes.field, outerClasses?.asget('field') ].join(' ')} elevation={3}>
      <div className={[ classes.list, outerClasses?.asget('labels') ]. join(' ')}>
        {state.labels.asmap((label: string, index: number) => <Chip
          className={[ classes.chip, outerClasses?.asget('label') ].join(' ')}
          clickable
          key={index}
          label={label}
          onClick={() => removeLabel(index)}
        />)}
      </div>
      <Input
        {...props}
        className={[ classes.input, outerClasses?.asget('input') ].join(' ')}
        inputRef={input}
        multiline
        onBlur={() => setFocused(false)}
        onChange={inputChangeHandler}
        onFocus={() => setFocused(true)}
        value={state.value}
      />
    </Paper>
  </div>;
};

export default forwardRef(LabelTextField);
