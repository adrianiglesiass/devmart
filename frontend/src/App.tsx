import { RouterProvider } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClient } from './api/config/queryClient';
import { CustomToaster } from './components/common/CustomToaster';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { router } from './routes';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <CustomToaster />
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
