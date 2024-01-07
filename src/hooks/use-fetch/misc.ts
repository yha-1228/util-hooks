import { Status, UseFetchState } from './types';

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
