import React, { lazy, Suspense } from 'react';
import type { ReactElement } from 'react';
import SuspenseLoading from '../components/SuspenseWeather/SuspenseLoading';

export const lazyLoad = <T extends React.ComponentType<unknown>>(importFn: () => Promise<{ default: T }>): ReactElement => {
  const Component = lazy(importFn) as React.LazyExoticComponent<T>;
  return (
    <Suspense fallback={<SuspenseLoading />}>
      <Component />
    </Suspense>
  );
};

export default lazyLoad;
