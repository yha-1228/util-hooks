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

export function createContextState<HookResult, SetterKey extends string>(
  useHook: () => HookResult,
  setterKey: SetterKey,
  debugOptions?: HookDebugOptions
): readonly [() => HookResult, React.FC<React.PropsWithChildren>];

export function createContextState<
  HookOption,
  HookResult,
  SetterKey extends string
>(
  useHook: (option?: HookOption) => HookResult,
  setterKey: SetterKey,
  debugOptions?: HookDebugOptions
): readonly [
  () => HookResult,
  React.FC<React.PropsWithChildren<{ [k in SetterKey]?: HookOption }>>
];

export function createContextState<
  HookOption,
  HookResult,
  SetterKey extends string
>(
  useHook: (option: HookOption) => HookResult,
  setterKey: SetterKey,
  debugOptions?: HookDebugOptions
): readonly [
  () => HookResult,
  React.FC<React.PropsWithChildren<{ [k in SetterKey]: HookOption }>>
];

export function createContextState<
  HookOption,
  HookResult,
  SetterKey extends string
>(
  useHook: (option: HookOption) => HookResult,
  setterKey: SetterKey,
  debugOptions?: HookDebugOptions
) {
  if (useHook.length > 1) {
    throw new Error('Hook args must be up to one');
  }

  if (!debugOptions?.providerName) {
    console.warn('Please set provider name.');
  }

  const [Context, useContext] = createContext<HookResult>({
    hookName: debugOptions?.hookName,
    providerName: debugOptions?.providerName,
  });

  const Provider: React.FC<
    React.PropsWithChildren<{ [k in SetterKey]: HookOption }>
  > = (props) => {
    const hookValue = useHook(props[setterKey]);

    return (
      <Context.Provider value={hookValue}>{props.children}</Context.Provider>
    );
  };

  Provider.displayName = debugOptions?.providerName;

  return [useContext, Provider] as const;
}
