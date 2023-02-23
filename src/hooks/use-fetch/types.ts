export type UseFetchOptions<Data> = {
  fetchFn: () => Promise<Data>;
  depsKey?: React.DependencyList;
  enabled?: boolean;
  initialData?: Data;
  onSuccess?: (data: Data) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
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
