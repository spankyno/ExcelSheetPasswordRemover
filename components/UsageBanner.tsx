import React from 'react';
import { Zap, AlertTriangle } from 'lucide-react';

interface UsageBannerProps {
  remaining: number | null;
  dailyLimit: number | null;
  isSignedIn: boolean;
}

const UsageBanner: React.FC<UsageBannerProps> = ({ remaining, dailyLimit, isSignedIn }) => {
  if (!isSignedIn || dailyLimit === null || remaining === null) return null;

  const isExhausted = remaining === 0;
  const isLow = remaining === 1;

  return (
    <div
      className={`
        flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium border
        ${isExhausted
          ? 'bg-red-50 border-red-200 text-red-700'
          : isLow
          ? 'bg-amber-50 border-amber-200 text-amber-700'
          : 'bg-blue-50 border-blue-200 text-blue-700'}
      `}
    >
      {isExhausted ? (
        <AlertTriangle size={15} className="flex-shrink-0" />
      ) : (
        <Zap size={15} className="flex-shrink-0" />
      )}
      <span>
        {isExhausted
          ? 'Has agotado tus 2 usos diarios. Vuelve mañana.'
          : `Te queda ${remaining} uso${remaining === 1 ? '' : 's'} hoy (límite diario: ${dailyLimit}).`}
      </span>
    </div>
  );
};

export default UsageBanner;
