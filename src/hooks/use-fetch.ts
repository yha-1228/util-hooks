import { DependencyList, useRef, useEffect, useState } from 'react';

export type UseFetchOptions<Data> = {
  fetchFn: () => Promise<Data>;
  depsKey?: DependencyList;
  enabled?: boolean;
  initialData?: Data;
};

export type UseFetchState<Data = unknown> = {
  data: Data | undefined;
  isFetching: boolean;
  error: Error | undefined;
};

export type Status = 'loading' | 'success' | 'error';

type UseFetchBaseResult<Data = unknown> = UseFetchState<Data> & {
  status: Status;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  refetch: () => void;
  setDataForce: (data: Data) => void;
};

interface UseFetchLoadingResult extends UseFetchBaseResult {
  status: 'loading';
  data: undefined;
  error: undefined;
  isLoading: true;
  isSuccess: false;
  isError: false;
}

interface UseFetchSuccessResult<Data> extends UseFetchBaseResult<Data> {
  status: 'success';
  data: Data;
  isLoading: false;
  isSuccess: true;
  isError: false;
}

interface UseFetchErrorResult<Data> extends UseFetchBaseResult<Data> {
  status: 'error';
  error: Error;
  isLoading: false;
  isSuccess: false;
  isError: true;
}

export type UseFetchResult<Data> =
  | UseFetchLoadingResult
  | UseFetchSuccessResult<Data>
  | UseFetchErrorResult<Data>;

export const judgeIsLoading = <Data>(state: UseFetchState<Data>) => {
  return !state.data && !state.error;
};

export const judgeIsSuccess = <Data>(state: UseFetchState<Data>) => {
  return !!state.data;
};

export const judgeIsError = <Data>(state: UseFetchState<Data>) => {
  return !!state.error;
};

class UnfedinedStatusError extends Error {
  constructor(...params: Parameters<ErrorConstructor>) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnfedinedStatusError);
    }

    this.name = 'UnfedinedStatusError';
  }
}

export const getStatus = <Data>(state: UseFetchState<Data>): Status => {
  if (judgeIsLoading(state)) return 'loading';
  if (judgeIsError(state)) return 'error';
  if (judgeIsSuccess(state)) return 'success';

  throw new UnfedinedStatusError(`Undefined status`);
};

function useFetch<Data>(options: UseFetchOptions<Data>): UseFetchResult<Data> {
  const {
    fetchFn,
    depsKey = [],
    enabled = true,
    initialData = undefined,
  } = options;

  const savedFetchFn = useRef(fetchFn);

  useEffect(() => {
    savedFetchFn.current = fetchFn;
  }, [fetchFn]);

  const [state, setState] = useState<UseFetchState<Data>>({
    data: initialData,
    isFetching: false,
    error: undefined,
  });

  const setDataForce = (data: Data) => {
    setState((prev) => ({ ...prev, data }));
  };

  const refetch = async () => {
    setState((prev) => ({ ...prev, isFetching: true }));

    try {
      const data = await savedFetchFn.current();
      setState({ data, isFetching: false, error: undefined });
    } catch (_error) {
      if (_error instanceof Error) {
        const error = _error as Error;
        setState((prev) => ({ ...prev, isFetching: false, error }));
      } else {
        throw _error;
      }
    }
  };

  useEffect(() => {
    if (!enabled) return;

    let ignore = false;

    const fetch = async () => {
      setState((prev) => ({ ...prev, isFetching: true }));

      try {
        const data = await savedFetchFn.current();
        if (!ignore) {
          setState({ data, isFetching: false, error: undefined });
        }
      } catch (_error) {
        if (_error instanceof Error) {
          const error = _error as Error;
          if (!ignore) {
            setState((prev) => ({ ...prev, isFetching: false, error }));
          }
        } else {
          throw _error;
        }
      }
    };

    fetch();

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...depsKey]);

  const result = {
    ...state,
    status: getStatus(state),
    isLoading: judgeIsLoading(state),
    isSuccess: judgeIsSuccess(state),
    isError: judgeIsError(state),
    refetch,
    setDataForce,
  } as UseFetchResult<Data>;

  return result;
}

export { useFetch };
