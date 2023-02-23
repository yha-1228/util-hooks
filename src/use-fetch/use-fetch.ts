import { useEffect, useRef, useState } from 'react';
import {
  judgeIsError,
  judgeIsLoading,
  judgeIsSuccess,
  getStatus,
} from './misc';
import { UseFetchState, UseFetchOptions, UseFetchResult } from './types';

function useFetch<Data>(options: UseFetchOptions<Data>): UseFetchResult<Data> {
  const {
    fetchFn,
    depsKey = [],
    enabled = true,
    initialData = undefined,
    onSuccess,
    onError,
    onFinally,
  } = options;

  const savedFetchFn = useRef<UseFetchOptions<Data>['fetchFn']>();

  useEffect(() => {
    savedFetchFn.current = fetchFn;
  }, [fetchFn]);

  const savedOnSuccess = useRef<UseFetchOptions<Data>['onSuccess']>();

  useEffect(() => {
    savedOnSuccess.current = onSuccess;
  }, [onSuccess]);

  const savedOnError = useRef<UseFetchOptions<Data>['onError']>();

  useEffect(() => {
    savedOnError.current = onError;
  }, [onError]);

  const savedOnFinally = useRef<UseFetchOptions<Data>['onFinally']>();

  useEffect(() => {
    savedOnFinally.current = onFinally;
  }, [onFinally]);

  const [state, setState] = useState<UseFetchState<Data>>({
    data: initialData,
    isFetching: false,
    error: undefined,
  });

  const setDataForce = (data: Data) => {
    setState((prev) => ({ ...prev, data }));
  };

  const refetch = async () => {
    if (!savedFetchFn.current) return;

    setState((prev) => ({ ...prev, isFetching: true }));

    try {
      const data = await savedFetchFn.current();
      setState({ data, isFetching: false, error: undefined });
      savedOnSuccess.current?.(data);
    } catch (_error) {
      if (_error instanceof Error) {
        const error = _error as Error;
        setState((prev) => ({ ...prev, isFetching: false, error }));
        savedOnError.current?.(_error);
      } else {
        throw _error;
      }
    } finally {
      savedOnFinally.current?.();
    }
  };

  useEffect(() => {
    if (!enabled) return;

    let ignore = false;

    const fetch = async () => {
      if (!savedFetchFn.current) return;

      setState((prev) => ({ ...prev, isFetching: true }));

      try {
        const data = await savedFetchFn.current();
        if (!ignore) {
          setState({ data, isFetching: false, error: undefined });
          savedOnSuccess.current?.(data);
        }
      } catch (_error) {
        if (_error instanceof Error) {
          const error = _error as Error;
          if (!ignore) {
            setState((prev) => ({ ...prev, isFetching: false, error }));
            savedOnError.current?.(_error);
          }
        } else {
          throw _error;
        }
      } finally {
        savedOnFinally.current?.();
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
