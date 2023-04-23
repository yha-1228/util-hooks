import React from 'react';

export function useTimeout(callback: () => void, timeout = 0) {
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => savedCallback.current(), timeout);
    return () => clearTimeout(timeoutId);
  }, [timeout]);
}
