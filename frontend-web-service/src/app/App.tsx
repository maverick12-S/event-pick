import { RouterProvider } from 'react-router-dom';
import { router } from '../routes';
import { AuthProvider } from '../contexts/AuthContext';

// App はプロバイダーの組み立てとルーターのみ担当する
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
