import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ErrorBlockProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export function ErrorBlock({
  title = "Something went wrong",
  message,
  onRetry,
  onBack
}: ErrorBlockProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p>{message}</p>

        {(onRetry || onBack) && (
          <div className="flex gap-3 mt-4">
            {onRetry && (
              <Button variant="outline" onClick={onRetry}>
                Try Again
              </Button>
            )}

            {onBack && (
              <Button variant="ghost" onClick={onBack}>
                Go Back
              </Button>
            )}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
