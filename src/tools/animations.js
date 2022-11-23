import React from 'react';
import {
  useSpring,
  useTransition,
  animated
} from 'react-spring';

export const Fade = React.forwardRef(({
  in: open,
  children,
  onEnter,
  onExited,
  ...other
}, ref) => {
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) onEnter();
    },
    onRest: () => {
      if (!open && onExited) onExited();
    },
  });
  return (
    <animated.div
      ref={ref}
      style={style}
      {...other}
    >
      {children}
    </animated.div>
  );
});

export const Appear = React.forwardRef(({
  in: open,
  children,
  onEnter,
  onExited,
  ...other
}, ref) => {
  const transitions = useTransition(open, {
    from: { opacity: 0, transform: 'translateY(-40px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(-40px)' },
    onStart: () => {
      if (open && onEnter) onEnter();
    },
    onRest: () => {
      if (!open && onExited) onExited();
    },
  });
  return transitions((style, item) =>
    item && (
      <animated.div
        ref={ref}
        style={style}
        {...other}
      >
        {children}
      </animated.div>
    )
  );
});
