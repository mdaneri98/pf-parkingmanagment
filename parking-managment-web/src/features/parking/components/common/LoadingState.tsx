
interface LoadingStateProps {
  itemCount?: number;
}

export function LoadingState({ itemCount = 4 }: LoadingStateProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: itemCount }).map((_, i) => (
        <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
      ))}
    </div>
  );
}