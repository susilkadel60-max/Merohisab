import React, { useState, useEffect } from 'react';
import {
  Wifi,
  BatteryCharging,
  Signal,
  Smartphone,
  Maximize2,
  Minimize2,
  FileArchive,
  HelpCircle,
} from 'lucide-react';
import { generateExpoProjectZip } from '../utils/expoProjectZip';
import { useDeveloperInfo } from '../utils/developerSettings';

interface Props {
  children: React.ReactNode;
  onOpenEasModal: () => void;
  currentTab: string;
}

export const AndroidFrame: React.FC<Props> = ({
  children,
  onOpenEasModal,
  currentTab,
}) => {
  const devInfo = useDeveloperInfo();
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [timeStr, setTimeStr] = useState('09:41');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickDownloadZip = async () => {
    try {
      setIsExporting(true);
      const blob = await generateExpoProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mero-hisab-expo-android-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('ZIP डाउनलोड गर्न समस्या भयो');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col items-center justify-start p-0 sm:p-4 md:p-6 font-['Mukta',sans-serif]">
      {/* Top Desktop Utility Control Bar (Outside the phone) */}
      <header className="w-full max-w-5xl mx-auto mb-3 flex items-center justify-between px-3 py-2 bg-slate-800/90 text-white rounded-2xl backdrop-blur-sm border border-slate-700/80 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
            हि
          </div>
          <span className="font-bold text-sm hidden sm:inline text-emerald-400">मेरो हिसाब</span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden md:inline">Developed by <strong className="text-emerald-400">{devInfo.developerName}</strong></span>
          <span className="text-slate-400 hidden md:inline">•</span>
          <span className="text-slate-300">Android Mobile App</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Expo Project ZIP button */}
          <button
            onClick={handleQuickDownloadZip}
            disabled={isExporting}
            className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-xs"
            title="सम्पूर्ण Expo प्रोजेक्ट डाउनलोड गर्नुहोस्"
          >
            <FileArchive className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isExporting ? 'डाउनलोड हुँदै...' : 'प्रोजेक्ट ZIP'}</span>
          </button>

          {/* EAS APK Guide button */}
          <button
            onClick={onOpenEasModal}
            className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-all"
            title="APK कसरी बनाउने?"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>APK गाइड</span>
          </button>

          {/* Toggle Phone Frame vs Full View */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-200 rounded-lg flex items-center gap-1.5 transition-all"
            title={isPhoneFrame ? 'फुल स्क्रिन हेर्नुहोस्' : 'मोबाइल फ्रेममा हेर्नुहोस्'}
          >
            {isPhoneFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">फुल स्क्रिन</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">मोबाइल फ्रेम</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Device Container: either Android Phone Mockup or Responsive Mobile Max-W */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[420px] rounded-[44px] shadow-2xl ring-[10px] ring-slate-800 border-[3px] border-slate-700 bg-white overflow-hidden my-auto'
            : 'max-w-xl bg-white rounded-3xl shadow-xl overflow-hidden'
        }`}
      >
        {/* Android Status Bar (System Bar) - Green #168447 */}
        <div className="bg-[#168447] text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs select-none">
          <span className="font-semibold tracking-tight tabular-nums">{timeStr}</span>

          {/* Camera Notch on Phone Frame */}
          {isPhoneFrame && (
            <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800 mx-auto -mt-1" />
          )}

          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryCharging className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Top App Header inside Android - Green #168447 */}
        <div className="bg-[#168447] text-white px-5 py-2.5 flex items-center justify-between shadow-xs border-b border-[#0f6334]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#0f6334] flex items-center justify-center font-bold text-white text-xs shadow-inner">
              हि
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight leading-none">मेरो हिसाब</div>
              <div className="text-[10px] text-emerald-100 mt-0.5">Mero Hisab • {currentTab}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenEasModal}
              className="text-[11px] font-bold bg-[#0f6334] hover:bg-[#0c4e29] px-2.5 py-1 rounded-full text-emerald-100 flex items-center gap-1 transition-colors"
            >
              <span>APK</span>
            </button>
          </div>
        </div>

        {/* Scrollable Screen Content with Subtle Background Watermark */}
        <main className="p-4 bg-slate-50/80 min-h-[580px] max-h-[calc(100vh-160px)] overflow-y-auto relative">
          {/* Background Watermark using user's original portrait photo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
          >
            <img
              src="/developer_watermark.png"
              alt=""
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = 'true';
                  target.src = '/assets/aistudio/file_00000000169082119dd46ff394e0b25c_f9c568bb.png';
                } else {
                  target.style.display = 'none';
                }
              }}
              className="max-h-[85%] max-w-[85%] object-contain opacity-[0.09] filter contrast-125 pointer-events-none transition-opacity"
            />
          </div>

          {/* Foreground App Content (high contrast, crisp white cards, 100% legibility) */}
          <div className="relative z-10">
            {children}
          </div>
        </main>

        {/* Android Bottom Navigation Gesture Bar - Red #C62828 anchor */}
        {isPhoneFrame && (
          <div className="bg-[#C62828] py-1.5 flex justify-center border-t border-red-900/40">
            <div className="w-28 h-1 rounded-full bg-white/40" />
          </div>
        )}
      </div>

      {/* Outer Footnote */}
      <footer className="text-[11px] text-slate-400 mt-3 text-center">
        मेरो हिसाब (Mero Hisab) • Developed By: <strong className="text-emerald-400 font-semibold">{devInfo.developerName}</strong> • {devInfo.developmentDateBS} • All Rights Reserved
      </footer>
    </div>
  );
};
