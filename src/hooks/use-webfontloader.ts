import React from 'react';
import WebFont from 'webfontloader';

type UseWebFontLoaderConfig = Pick<
  WebFont.Config,
  | 'classes'
  | 'events'
  | 'timeout'
  | 'context'
  | 'custom'
  | 'google'
  | 'typekit'
  | 'fontdeck'
  | 'monotype'
>;

type WebFontConfigKeysFunc = keyof Pick<
  WebFont.Config,
  | 'loading'
  | 'active'
  | 'inactive'
  | 'fontloading'
  | 'fontactive'
  | 'fontinactive'
>;

type IsTriggered = Record<WebFontConfigKeysFunc, boolean>;

const initialIsTriggerd: IsTriggered = {
  loading: false,
  active: false,
  inactive: false,
  fontloading: false,
  fontactive: false,
  fontinactive: false,
};

export function useWebFontLoader(config: UseWebFontLoaderConfig) {
  const configRef = React.useRef(config);

  const [isTriggered, setIsTriggered] = React.useState(initialIsTriggerd);

  React.useEffect(() => {
    WebFont.load({
      ...configRef.current,

      loading() {
        setIsTriggered((prev) => ({ ...prev, loading: true }));
      },
      active() {
        setIsTriggered((prev) => ({ ...prev, active: true }));
      },
      inactive() {
        setIsTriggered((prev) => ({ ...prev, inactive: true }));
      },
      fontloading() {
        setIsTriggered((prev) => ({ ...prev, fontloading: true }));
      },
      fontactive() {
        setIsTriggered((prev) => ({ ...prev, fontactive: true }));
      },
      fontinactive() {
        setIsTriggered((prev) => ({ ...prev, fontinactive: true }));
      },
    });
  }, []);

  return isTriggered;
}
