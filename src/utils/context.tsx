import React from 'react';

type HookDebugOptions = {
  hookName?: string;
  providerName?: string;
};

type CreateContextOptions<T> = {
  defaultValue?: T;
} & HookDebugOptions;

/**
 * create context and context hook.
 */
export const createContext = <T,>(options?: CreateContextOptions<T>) => {
  const Context = React.createContext<T | undefined>(options?.defaultValue);

  function useContext(): T {
    const context = React.useContext(Context);
    if (context === undefined) {
      const hookName = options?.hookName || 'This hook';
      const providerName = options?.providerName
        ? `<${options?.providerName} />`
        : 'provider';
      const errorMsg = `${hookName} must be called within ${providerName}`;
      throw new Error(errorMsg);
    }
    return context;
  }

  return [Context, useContext] as const;
};

export function createContextState<HookOption, HookResult>(
  useHook: (option: HookOption) => HookResult,
  debugOptions?: HookDebugOptions
) {
  if (!debugOptions?.providerName) {
    console.warn('Please set provider name.');
  }

  const [Context, useContext] = createContext<HookResult>({
    hookName: debugOptions?.hookName,
    providerName: debugOptions?.providerName,
  });

  const Provider: React.FC<React.PropsWithChildren<{ option: HookOption }>> = (
    props
  ) => {
    const { children, option } = props;
    const hookValue = useHook(option as HookOption);

    return <Context.Provider value={hookValue}>{children}</Context.Provider>;
  };

  Provider.displayName = debugOptions?.providerName;

  return [useContext, Provider] as const;
}
