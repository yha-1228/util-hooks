import React from 'react';
import ReactDOM from 'react-dom/client';
import { useFetch } from './use-fetch';

// DEMO

type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

const baseURL = 'https://jsonplaceholder.typicode.com';

function App() {
  const { data, isLoading, isError } = useFetch<Todo[]>({
    fetchFn: () => fetch(`${baseURL}/todos`).then((res) => res.json()),
    depsKey: [],
  });

  if (isLoading) return <div>Loading</div>;
  if (isError) return <div>Error</div>;

  return <div>{JSON.stringify(data)}</div>;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
