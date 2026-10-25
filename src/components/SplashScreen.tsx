import React, { useEffect, useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useDeveloperInfo } from '../utils/developerSettings';

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const devInfo = useDeveloperInfo();
  const [fading, setFading] = useState(false);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    let closeTimer: ReturnType<typeof setTimeout> | undefined;

    const timer = setTimeout(() => {
      setFading(true);
      closeTimer = setTimeout(() => {
        onFinishRef.current();
      }, 300);
    }, 1500);

    return () => {
      clearTimeout(timer);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, []);

  const handleDismiss = () => {
    onFinishRef.current();
  };

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#168447] via-[#0f5c31] to-[#C62828] text-white p-8 transition-opacity duration-300 cursor-pointer ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top spacing */}
      <div className="w-full flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="text-xs text-emerald-300/80 hover:text-white px-3 py-1 rounded-full bg-emerald-800/40 border border-emerald-700/50"
        >
          छोड्नुहोस् (Skip)
        </button>
      </div>

      {/* Center Branding */}
      <div className="flex flex-col items-center text-center -mt-6">
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-3xl bg-white text-emerald-800 flex items-center justify-center font-extrabold text-4xl shadow-2xl ring-4 ring-emerald-500/30 animate-in zoom-in-95 duration-500">
            हि
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          मेरो हिसाब
        </h1>
        <p className="text-sm text-emerald-200 font-medium max-w-xs">
          नेपाली व्यक्तिगत आय-व्यय व्यवस्थापन
        </p>
        <span className="text-xs text-emerald-300/70 mt-1">
          बिक्रम संवत् क्यालेन्डर • अफलाइन पहिलो मोबाइल एप
        </span>

        {/* Subtle loading pulse */}
        <div className="mt-8 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse [animation-delay:200ms]" />
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse [animation-delay:400ms]" />
        </div>
      </div>

      {/* Bottom Developer Credits */}
      <div className="text-center pb-4">
        <div className="text-[11px] uppercase tracking-wider text-emerald-300/80 font-medium mb-1">
          सिर्जना तथा विकास
        </div>
        <div className="text-base font-bold tracking-wide text-white drop-shadow-sm flex items-center justify-center gap-1.5">
          <span>Developed by</span>
          <span className="text-amber-300 font-extrabold underline decoration-amber-400/50 underline-offset-4">
            {devInfo.developerName}
          </span>
        </div>
        <div className="text-[10px] text-emerald-400/60 mt-1">
          Mero Hisab v1.0.0 • {devInfo.developmentDateBS} • All Rights Reserved
        </div>
      </div>
    </div>
  );
};
