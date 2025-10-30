import { useLocation } from 'react-router';

import { useEffect } from 'react';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' as ScrollBehavior,
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
