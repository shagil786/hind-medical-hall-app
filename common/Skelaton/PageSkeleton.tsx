import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const PageSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Page Skeleton</h1>
      <Skeleton className="h-8 w-3/4 bg-gray-300" />
      <Skeleton className="h-64 w-full bg-gray-300" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-gray-300" />
        <Skeleton className="h-4 w-5/6 bg-gray-300" />
        <Skeleton className="h-4 w-4/6 bg-gray-300" />
      </div>
      <Skeleton className="h-10 w-full bg-gray-300" />
    </div>
  );
};
