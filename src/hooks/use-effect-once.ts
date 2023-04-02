import React from 'react';

export function useEffectOnce(handlar: () => void) {
  const savedHandlar = React.useRef(handlar);

  React.useEffect(() => {
    savedHandlar.current = handlar;
  }, [handlar]);

  const done = React.useRef(false);

  React.useEffect(() => {
    if (!done.current) {
      savedHandlar.current();
      done.current = true;
    }
  }, []);
}
