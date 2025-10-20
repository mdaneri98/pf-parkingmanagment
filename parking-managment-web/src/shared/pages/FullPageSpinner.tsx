import { Loader2 } from "lucide-react";
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

export function FullPageSpinner() {
  const { t } = useTypedTranslation();

  return (
    <div className="flex h-screen w-full items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="flex flex-col items-center gap-3 text-neutral-600 dark:text-neutral-300">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm font-medium">{t('shared.fullPageSpinner.loading')}</span>
      </div>
    </div>
  );
}
