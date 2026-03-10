import { useEffect } from 'react';

export const useScrollOutside = (callback: () => void): void => {
  useEffect(() => {
    const handleClose = (): void => {
      callback();
    };

    document.addEventListener('scroll', handleClose);

    return () => {
      document.removeEventListener('scroll', handleClose);
    };
  }, []);
};
