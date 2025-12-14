import { Camera, X } from 'lucide-react';
import { useState } from 'react';

type PhotoReminderBannerProps = {
  clientName: string;
};

export function PhotoReminderBanner({ clientName }: PhotoReminderBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-t border-amber-200 px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
          <Camera className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-amber-900">
            <span>Daily progress photo required for {clientName}</span>
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            Add at least one photo today to complete documentation.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="w-6 h-6 rounded-full hover:bg-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
