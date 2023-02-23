import React, { ReactNode, cloneElement } from 'react';

const compose = (children: ReactNode, ...elements: JSX.Element[]) => {
  return (
    <>
      {elements.reduceRight(
        (prev, current) => cloneElement(current, current.props, prev),
        children
      )}
    </>
  );
};

/**
 * @example
 * ```tsx
 * const Providers = withCompose(
 *   <AuthProvider />,
 *   <ThemeProvider default="light" />,
 *   <LangProvider default="ja" />,
 *   <QueryClientProvider />
 * );
 *
 * Providers.displayName = "Providers"
 *
 * return <Providers>...</Providers>
 * ```
 */
export function withCompose(...elements: JSX.Element[]) {
  const Composed: React.FC<React.PropsWithChildren> = ({ children }) => {
    return compose(children, ...elements);
  };

  return Composed;
}
