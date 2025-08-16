import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingBlockProps {
  message?: string;
  type?: 'inline' | 'skeleton' | 'full';
  countdown?: number;
  showCountdown?: boolean;
}

export function LoadingBlock({
  message = "Loading content...",
  type = 'full',
  countdown,
  showCountdown = false
}: LoadingBlockProps) {

  if (type === 'inline') {
    return (
      <div className="flex items-center text-sm text-gray-500">
        <Loader2 size={16} className="animate-spin mr-2" />
        {message}
        {showCountdown && countdown !== undefined && (
          <span className="ml-1 text-xs">({countdown}s)</span>
        )}
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-4/5" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="space-y-2 pt-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 size={32} className="animate-spin text-primary mb-4" />
      <p className="text-lg font-medium text-center">{message}</p>

      {showCountdown && countdown !== undefined && (
        <div className="mt-2 text-sm text-gray-500">
          Please wait, this may take up to {countdown} seconds
        </div>
      )}
    </div>
  );
}
