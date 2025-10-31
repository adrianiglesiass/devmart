import { Toaster } from 'sonner';

import { useEffect, useState } from 'react';

export function CustomToaster() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Toaster
      position={isMobile ? 'bottom-center' : 'top-right'}
      richColors
      duration={2000}
      closeButton
      toastOptions={{
        style: {
          fontSize: '14px',
          zIndex: 9999,
        },
      }}
    />
  );
}
