import { PropsWithChildren } from 'react';
import { Card, CardBody, CardTitle } from '@shared/ui/components';

export function AuthCard({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <Card variant="elevated" className="w-full max-w-md mx-auto animate-fade-in">
      <CardBody className="space-y-6">
        <div className="text-center">
          <CardTitle className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </CardTitle>
        </div>
        {children}
      </CardBody>
    </Card>
  );
}


