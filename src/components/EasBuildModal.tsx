import React, { useState } from 'react';
import { X, Download, Terminal, Smartphone, CheckCircle2, AlertCircle, FileArchive, Copy, Check } from 'lucide-react';
import { generateExpoProjectZip } from '../utils/expoProjectZip';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EasBuildModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      const blob = await generateExpoProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mero-hisab-expo-android-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      console.error(e);
      alert('ZIP डाउनलोड गर्न समस्या भयो');
    } finally {
      setDownloading(false);
    }
  };

  const copyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: '१. निर्भरता स्थापना गर्नुहोस् (Install Dependencies)',
      desc: 'जिप फाइल अनजिप गरी टर्मिनलमा जानुहोस्:',
      cmd: 'npm install',
    },
    {
      title: '२. EAS CLI इन्स्टल गर्नुहोस् (EAS CLI Setup)',
      desc: 'Expo Application Services को आधिकारिक टुल:',
      cmd: 'npm install -g eas-cli',
    },
    {
      title: '३. Expo मा लगइन गर्नुहोस् (Login to Expo)',
      desc: 'expo.dev खातामा लगइन गर्नुहोस् (निःशुल्क):',
      cmd: 'eas login',
    },
    {
      title: '४. सिधै इन्स्टल हुने APK बनाउनुहोस् (Build Standalone APK)',
      desc: 'यो कमाण्डले क्लाउडमा निर्माण गरी APK लिङ्क दिन्छ:',
      cmd: 'eas build --platform android --profile preview',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center shadow-inner">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Android APK निर्माण तथा प्रोजेक्ट एक्सपोर्ट</h2>
              <p className="text-xs text-emerald-200">
                मेरो हिसाब • Developed by SUSIL KADEL • EAS Pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-700/80 hover:bg-emerald-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Clarification Alert */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-xs text-amber-900 leading-relaxed">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-amber-950 mb-0.5">
                किन एउटा मात्र .ts फाइलबाट सीधै APK बन्दैन?
              </strong>
              एउटा TypeScript (.ts) फाइल केवल कोडको अंश हो। Android को लागि APK बन्न पूर्ण प्रोजेक्ट ढाँचा
              (<code className="bg-amber-100 px-1 rounded">package.json</code>, <code className="bg-amber-100 px-1 rounded">app.json</code>,{' '}
              <code className="bg-amber-100 px-1 rounded">eas.json</code>, AndroidManifest र नेटिभ इन्जिन) चाहिन्छ।
              तपाईं तलको बटन थिचेर <strong>सम्पूर्ण फाइलहरू भएको .ZIP</strong> डाउनलोड गर्न सक्नुहुन्छ!
            </div>
          </div>

          {/* Download Complete Project ZIP Button */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                <FileArchive className="w-4 h-4 text-emerald-700" />
                सम्पूर्ण Expo प्रोजेक्ट (.ZIP) डाउनलोड गर्नुहोस्
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                सबै १३+ फाइलहरू, कन्फिगरेसन, क्यालेन्डर इन्जिन र स्क्रिनहरू समावेश छ
              </p>
            </div>
            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'प्याक हुँदैछ...' : 'प्रोजेक्ट ZIP डाउनलोड'}
            </button>
          </div>

          {/* Included Files Inventory */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              प्रोजेक्ट संरचना (All Required Source Files Included)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
              <div>📄 app.json (Android Identifier)</div>
              <div>📄 eas.json (APK Profile Config)</div>
              <div>📄 package.json (All Native Libs)</div>
              <div>📄 tsconfig.json (TypeScript)</div>
              <div>📱 App.tsx (Root Safe Area + Nav)</div>
              <div>📜 src/types/index.ts (Types)</div>
              <div>📅 src/utils/bikramSambat.ts</div>
              <div>💾 src/utils/storage.ts</div>
              <div>🧭 src/navigation/AppNavigator.tsx</div>
              <div>📊 src/screens/DashboardScreen.tsx</div>
              <div>🗓️ src/screens/CalendarScreen.tsx</div>
              <div>➕ src/screens/AddTransactionScreen.tsx</div>
              <div>📋 src/screens/HistoryScreen.tsx</div>
              <div>📈 src/screens/ReportsScreen.tsx</div>
            </div>
          </div>

          {/* EAS Build Terminal Steps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              APK निर्माण चरणहरू (Terminal Commands)
            </h4>
            <div className="space-y-3">
              {steps.map((st, idx) => (
                <div key={idx} className="bg-slate-900 rounded-xl p-3 text-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-emerald-400">{st.title}</span>
                    <span className="text-[10px] text-slate-400">{st.desc}</span>
                  </div>
                  <div className="flex items-center justify-between bg-black/50 px-3 py-1.5 rounded-lg font-mono text-xs text-slate-200">
                    <span className="truncate mr-2">$ {st.cmd}</span>
                    <button
                      onClick={() => copyCommand(st.cmd, idx)}
                      className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                      title="कमाण्ड कपी गर्नुहोस्"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instant PWA Alternative */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
            <strong className="font-semibold block text-blue-950 mb-0.5">
              💡 तुरुन्तै Android फोनमा मोबाइल एपको रूपमा चलाउन:
            </strong>
            यो वेब लिङ्कलाई आफ्नो Android फोनको <strong>Google Chrome</strong> मा खोल्नुहोस्, माथिको तीन थोप्ला
            (⋮) थिच्नुहोस् र <strong>"Add to Home screen" (वा "Install App")</strong> छान्नुहोस्। यो सीधै मोबाइल
            स्क्रिनमा नेटिभ एप झैँ इन्स्टल भएर अफलाइन पनि काम गर्छ!
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-600 font-medium">
            मेरो हिसाब • Developed by <strong className="text-emerald-800">SUSIL KADEL</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors"
          >
            बुझें, बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};
