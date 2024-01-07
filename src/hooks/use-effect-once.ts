import { EffectCallback, useRef, useEffect } from 'react';

export function useEffectOnce(effect: EffectCallback) {
  const doneRef = useRef(false);

  useEffect(() => {
    if (!doneRef.current) {
      effect();
      doneRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
