import React from 'react';

function useStateWithReset<S>(initialState: S | (() => S)) {
  const [state, setState] = React.useState(initialState);

  const resetState = () => setState(initialState);

  return [state, setState, resetState] as const;
}

export { useStateWithReset };
