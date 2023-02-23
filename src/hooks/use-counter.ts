import { useState } from 'react';

type UseCounterResult = {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

export function useCounter(initial = 0): UseCounterResult {
  const [count, setCount] = useState(initial);

  const increment = () => setCount((prev) => prev + 1);

  const decrement = () => setCount((prev) => prev - 1);

  const reset = () => setCount(initial);

  return { count, setCount, increment, decrement, reset };
}
