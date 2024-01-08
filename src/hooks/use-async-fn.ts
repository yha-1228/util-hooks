import { DependencyList, useRef, useEffect, useState } from 'react';

export type UseAsyncOptions<TData = unknown> = {
  /**
   * リクエストする非同期関数
   */
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
  /**
   * データ取得の状態
   *
   * - `idle`: 初期状態
   * - `validating`: 検証中 (`isLoading === true`)
   * - `success`: データ取得に成功した状態
   * - `error`: データ取得に失敗した状態
   */
  status: 'idle' | 'validating' | 'success' | 'error' | 'manually-updated';
  /**
   * 非同期関数から取得したデータ
   */
  data: TData | undefined;
  /**
   * リクエストしてから結果が返るまでの間、`true`になる。
   */
  isValidating: boolean;
  /**
   * 発生したエラー
   */
  error: TError | undefined;
}

export interface UseAsyncResult<TData = unknown, TError = Error>
  extends UseAsyncState<TData, TError> {
  /**
   * 初期状態、つまり`!data && !error`のとき、`true`になる。
   */
  isLoading: boolean;
  /**
   * リクエストを手動で実行する。
   */
  refresh: () => Promise<void>;
  /**
   * 非同期関数をリクエストせずに、手動で`data`を更新する。
   */
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
    status: 'idle',
    data: undefined,
    isValidating: false,
    error: undefined,
  });

  const refresh = async () => {
    if (!enabled) return;

    setState((prev) => ({ ...prev, status: 'validating', isValidating: true }));

    try {
      const data = await asyncFnRef.current();
      setState({
        status: 'success',
        data,
        isValidating: false,
        error: undefined,
      });
    } catch (_error) {
      if (_error instanceof Error) {
        const error = _error as TError;
        setState({
          status: 'error',
          data: undefined,
          isValidating: false,
          error,
        });
      } else {
        throw _error;
      }
    }
  };

  useEffect(() => {
    if (!enabled) return;

    let ignore = false;

    const execute = async () => {
      setState((prev) => ({
        ...prev,
        status: 'validating',
        isValidating: true,
      }));

      try {
        const data = await asyncFnRef.current();
        if (!ignore) {
          setState({
            status: 'success',
            data,
            isValidating: false,
            error: undefined,
          });
        }
      } catch (_error) {
        if (_error instanceof Error) {
          const error = _error as TError;
          if (!ignore) {
            setState({
              status: 'error',
              data: undefined,
              isValidating: false,
              error,
            });
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
    refresh,
    setData: (nextData: TData) =>
      setState({
        status: 'manually-updated',
        data: nextData,
        isValidating: false,
        error: undefined,
      }),
  };

  return result;
}
