import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  ReactNode,
  KeyboardEvent as RKeyboardEvent,
  ComponentType,
  Ref
} from 'react';

import classes from './keyMapStyle.sass';

interface IProps {
  tabIndex: number
}

interface IChildProps {
  ref: Ref<unknown>
  actionKeys: (event: RKeyboardEvent | KeyboardEvent) => void
  focusKeys: () => void
  setKeys: React.Dispatch<React.SetStateAction<IKeys>>
}

interface IKeys {
  [key: string]: (event: RKeyboardEvent | KeyboardEvent) => void
}

export default (Component: ComponentType<IChildProps>, focusNeeded = true): ReactNode => forwardRef(
  ({ tabIndex = 0, ...props }: IProps, ref) => {

    const [ keys, setKeys ] = useState<IKeys>({});
    const refKey = useRef<HTMLDivElement>(null);

    const actions = (event: RKeyboardEvent | KeyboardEvent) => {
      const action = keys[event.key];

      if (action) {
        event?.preventDefault();
        event?.stopPropagation();
        action(event);
      }
      return event;
    };

    useEffect(() => {
      if (focusNeeded) return;

      window.addEventListener('keydown', actions);
      return () => window.removeEventListener('keydown', actions);
    }, [keys]);

    return focusNeeded ?
      <div className={classes.map} onKeyDown={focusNeeded ? actions : undefined} ref={refKey} tabIndex={tabIndex}>
        <Component
          ref={ref}
          {...props}
          actionKeys={actions}
          focusKeys={() => refKey.current?.focus()}
          setKeys={setKeys}
        />
      </div> :
      <Component
        ref={ref}
        {...props}
        actionKeys={actions}
        focusKeys={() => null}
        setKeys={setKeys}
      />;
  });
