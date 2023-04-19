import { useState } from 'react';

export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);

  const add = (ammount = 1) => setCount((prev) => prev + ammount);

  const sub = (ammount = 1) => setCount((prev) => prev - ammount);

  const reset = () => setCount(initial);

  return [count, { setCount, add, sub, reset }] as const;
}
