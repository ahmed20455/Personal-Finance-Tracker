'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function QueryClientWrapper({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        staleTime: 0,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Remove ReactQueryDevtools completely */}
    </QueryClientProvider>
  );
}