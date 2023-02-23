import { useState } from 'react';

type UseArrayResult<T> = {
  array: T[];
  setArray: React.Dispatch<React.SetStateAction<T[]>>;
  insert: (newValue: T) => void;
  update: (selectedIndex: number, newValue: T) => void;
  remove: (selectedValue: T) => void;
  removeByIndex: (selectedIndex: number) => void;
  toggle: (selectedValue: T) => void;
  reset: () => void;
};

export function useArray<T>(initial: T[] | (() => T[])): UseArrayResult<T> {
  const [array, setArray] = useState<T[]>(initial);

  const insert = (newValue: T) => {
    setArray((prev) => [...prev, newValue]);
  };

  const update = (selectedIndex: number, newValue: T) => {
    setArray((prev) =>
      prev.map((value, index) => {
        if (index === selectedIndex) return newValue;
        return value;
      })
    );
  };

  const remove = (selectedValue: T) => {
    setArray((prev) => prev.filter((value) => value !== selectedValue));
  };

  const removeByIndex = (selectedIndex: number) => {
    setArray((prev) => prev.filter((_value, index) => index !== selectedIndex));
  };

  const toggle = (selectedValue: T) => {
    if (array.includes(selectedValue)) {
      setArray((prev) => prev.filter((value) => value !== selectedValue));
    } else {
      setArray((prev) => [...prev, selectedValue]);
    }
  };

  const reset = () => {
    setArray(initial);
  };

  return {
    array,
    setArray,
    insert,
    update,
    remove,
    removeByIndex,
    toggle,
    reset,
  };
}
