import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClient } from './api/config/queryClient';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { router } from './routes';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            richColors
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
