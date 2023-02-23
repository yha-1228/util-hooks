import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { createContextState } from './utils/context';

function useCount() {
  const [cnt, setCnt] = useState(5);

  const inc = () => setCnt((prev) => prev + 1);

  return { cnt, inc };
}

const [useCountCtx, CountProvider] = createContextState(useCount, {
  hookName: 'useCountCtx',
  providerName: 'CountProvider',
});

function Inner() {
  const res = useCountCtx();

  return <button onClick={res.inc}>{res.cnt}</button>;
}

function App() {
  return (
    <CountProvider>
      <Inner />
    </CountProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
