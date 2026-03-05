import React, { lazy, Suspense } from 'react';
import type { ReactElement } from 'react';
import SuspenseLoading from '../components/SuspenseWeather/SuspenseLoading';

export const lazyLoad = (importFn: () => Promise<{ default: React.ComponentType<any> }>): ReactElement => {
  const Component = lazy(importFn) as React.LazyExoticComponent<React.ComponentType<any>>;
  return (
    <Suspense fallback={<SuspenseLoading />}>
      <Component />
    </Suspense>
  );
};

export default lazyLoad;
