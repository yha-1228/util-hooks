import { DependencyList, useRef, useEffect, useState } from 'react';

export type UseAsyncOptions<TData = unknown> = {
  asyncFn: () => Promise<TData>;
  /**
   * @default []
   */
  deps?: DependencyList;
  /**
   * @default true
   */
  enabled?: boolean;
};

export interface UseAsyncState<TData = unknown, TError = Error> {
  data: TData | undefined;
  isValidating: boolean;
  error: TError | undefined;
}

export interface UseAsyncResult<TData = unknown, TError = Error>
  extends UseAsyncState<TData, TError> {
  isLoading: boolean;
  revalidate: () => Promise<void>;
  setData: (nextData: TData) => void;
}

export function useAsyncFn<TData = unknown, TError = Error>(
  options: UseAsyncOptions<TData>
): UseAsyncResult<TData, TError> {
  const { asyncFn, deps = [], enabled = true } = options;

  const asyncFnRef = useRef(asyncFn);

  useEffect(() => {
    asyncFnRef.current = asyncFn;
  }, [asyncFn]);

  const [state, setState] = useState<UseAsyncState<TData, TError>>({
    data: undefined,
    isValidating: false,
    error: undefined,
  });

  const revalidate = async () => {
    if (!enabled) return;

    setState((prev) => ({ ...prev, isValidating: true }));

    try {
      const data = await asyncFnRef.current();
      setState({ data, isValidating: false, error: undefined });
    } catch (_error) {
      if (_error instanceof Error) {
        const error = _error as TError;
        setState((prev) => ({ ...prev, isValidating: false, error }));
      } else {
        throw _error;
      }
    }
  };

  useEffect(() => {
    if (!enabled) return;

    let ignore = false;

    const execute = async () => {
      setState((prev) => ({ ...prev, isValidating: true }));

      try {
        const data = await asyncFnRef.current();
        if (!ignore) {
          setState({ data, isValidating: false, error: undefined });
        }
      } catch (_error) {
        if (_error instanceof Error) {
          const error = _error as TError;
          if (!ignore) {
            setState((prev) => ({ ...prev, isValidating: false, error }));
          }
        } else {
          throw _error;
        }
      }
    };

    execute();

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  const result: UseAsyncResult<TData, TError> = {
    ...state,
    isLoading: !state.data && !state.error,
    revalidate,
    setData: (nextData: TData) =>
      setState((prev) => ({ ...prev, data: nextData })),
  };

  return result;
}
