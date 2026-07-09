'use client';

import { useUIStore } from '@/lib/store/ui-store';
import { X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { notifications, removeNotification } = useUIStore();

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 pointer-events-none md:max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="pointer-events-auto animate-in slide-in-from-right-full duration-200"
        >
          <Alert
            variant={
              notification.type === 'error'
                ? 'destructive'
                : notification.type === 'success'
                  ? 'default'
                  : 'default'
            }
            className={cn(
              'flex items-start gap-3 pr-2',
              notification.type === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-900',
              notification.type === 'error' && 'border-red-200 bg-red-50 text-red-900',
              notification.type === 'info' && 'border-blue-200 bg-blue-50 text-blue-900',
              notification.type === 'warning' && 'border-amber-200 bg-amber-50 text-amber-900'
            )}
          >
            <AlertDescription className="flex-1 text-sm">{notification.message}</AlertDescription>
            <button
              onClick={() => removeNotification(notification.id)}
              className="mt-0.5 shrink-0 opacity-70 hover:opacity-100"
            >
              <X className="size-4" />
            </button>
          </Alert>
        </div>
      ))}
    </div>
  );
}
