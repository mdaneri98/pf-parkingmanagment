import { AlertTriangle } from "lucide-react";

interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorScreen({ message = "Something went wrong.", onRetry }: ErrorScreenProps) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-md dark:border-neutral-700 dark:bg-neutral-800">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <p className="text-center text-sm font-medium text-neutral-700 dark:text-neutral-200">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-offset-neutral-900"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
