import { useState } from 'react';

type UseBooleanOptions = {
  initial?: boolean;
  onToggled?: (nextState: boolean) => void;
};

export function useBoolean(opions: UseBooleanOptions) {
  const { initial, onToggled } = opions;

  const [state, setState] = useState(initial);

  const on = () => setState(true);

  const off = () => setState(false);

  const toggle = () => {
    const nextState = !state;
    setState(nextState);
    onToggled?.(nextState);
  };

  const reset = () => setState(initial);

  return [state, { on, off, toggle, reset }] as const;
}
