import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { exportTransactionsToCSV } from '../utils/storage';
import { toNepaliDigits } from '../utils/bikramSambat';
import {
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Cloud,
  FileSpreadsheet,
  Trash2,
  ExternalLink,
  Info,
  CheckCircle2,
  FileArchive,
  User,
  Code2,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { generateExpoProjectZip } from '../utils/expoProjectZip';
import {
  getDeveloperSettings,
  saveDeveloperSettings,
  resetDeveloperSettings,
  getAppProjectInitBSDate,
  formatBSDateNepali,
  DeveloperSettings,
} from '../utils/developerSettings';
import { getTodayBS } from '../utils/bikramSambat';

interface Props {
  onOpenEasModal: () => void;
  onReplaySplash?: () => void;
}

export const ProfileSettingsScreen: React.FC<Props> = ({
  onOpenEasModal,
  onReplaySplash,
}) => {
  const { transactions, resetToDemoData, clearAll } = useTransactions();
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Developer info settings state
  const [devSettings, setDevSettings] = useState<DeveloperSettings>(() => getDeveloperSettings());
  const [devNameInput, setDevNameInput] = useState(devSettings.developerName);
  const [devDateInput, setDevDateInput] = useState(devSettings.developmentDateBS);

  const handleSaveDeveloperSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: DeveloperSettings = {
      developerName: devNameInput.trim() || 'SUSIL KADEL',
      developmentDateBS: devDateInput.trim() || getAppProjectInitBSDate(),
    };
    saveDeveloperSettings(updated);
    setDevSettings(updated);
    setDevNameInput(updated.developerName);
    setDevDateInput(updated.developmentDateBS);
    setFeedbackMsg('विकासकर्ता विवरण (Developed By) सफलतापूर्वक सुरक्षित गरियो!');
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleResetDeveloperSettings = () => {
    const def = resetDeveloperSettings();
    setDevSettings(def);
    setDevNameInput(def.developerName);
    setDevDateInput(def.developmentDateBS);
    setFeedbackMsg('सुरुवाती पूर्वनिर्धारित विकासकर्ता विवरण पुनर्स्थापना गरियो!');
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleExportCSV = () => {
    exportTransactionsToCSV(transactions);
    setFeedbackMsg('CSV ब्याकअप फाइल सफलतापूर्वक डाउनलोड भयो!');
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleDownloadExpoZip = async () => {
    try {
      setDownloadingZip(true);
      const blob = await generateExpoProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mero-hisab-expo-android-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setFeedbackMsg('पूर्ण Expo + React Native प्रोजेक्ट ZIP डाउनलोड भयो!');
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (e) {
      console.error(e);
      alert('ZIP डाउनलोड गर्न समस्या भयो');
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="pb-24 space-y-4">
      {/* Feedback banner */}
      {feedbackMsg && (
        <div className="p-3 bg-emerald-700 text-white text-xs font-semibold rounded-2xl flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Offline Mode Active Badge */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              डेमो स्क्रिन: स्थानीय अफलाइन मोड
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xs text-amber-900 mt-1 leading-relaxed">
            तपाईंको सम्पूर्ण कारोबार विवरण तपाईंको स्थानीय मोबाइल/ब्राउजर स्टोरेजमा सुरक्षित राखिएको छ।
            इन्टरनेट नहुँदा पनि यो एप पूर्ण रूपमा चल्छ र डाटा सुरक्षित रहन्छ।
          </p>
        </div>
      </div>

      {/* Standalone Android APK & EAS Build Center */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 flex items-center justify-center text-white shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Android APK तथा Expo प्रोजेक्ट</h3>
              <p className="text-xs text-emerald-200">
                EAS Build का लागि तयार पारिएको सम्पूर्ण प्रोजेक्ट
              </p>
            </div>
          </div>
          <button
            onClick={onOpenEasModal}
            className="text-xs bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors"
          >
            <span>गाइड</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-emerald-100 leading-relaxed">
          एउटा मात्र .ts फाइलको सट्टा यहाँबाट <code className="bg-emerald-950/60 px-1 py-0.5 rounded text-[11px]">app.json</code>,{' '}
          <code className="bg-emerald-950/60 px-1 py-0.5 rounded text-[11px]">eas.json</code> र सम्पूर्ण React Native कोड भएको .ZIP फाइल डाउनलोड गर्नुहोस्।
        </p>

        <div className="pt-1 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleDownloadExpoZip}
            disabled={downloadingZip}
            className="flex-1 px-4 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <FileArchive className="w-4 h-4 text-emerald-700" />
            {downloadingZip ? 'प्याक हुँदैछ...' : 'पूर्ण Expo प्रोजेक्ट (.ZIP) डाउनलोड'}
          </button>
          <button
            onClick={onOpenEasModal}
            className="px-4 py-2.5 bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            कमाण्ड गाइड हेर्नुहोस्
          </button>
        </div>
      </div>

      {/* CSV Data Backup and Export */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">डाटा ब्याकअप तथा निर्यात (CSV Export)</h3>
            <p className="text-xs text-slate-500">
              हालसम्मका कुल {toNepaliDigits(transactions.length)} वटा कारोबार एक्सेल/स्प्रेडसिटका लागि
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          आफ्नो सम्पूर्ण आम्दानी तथा खर्च विवरण UTF-8 फर्म्याटमा Excel वा Google Sheets मा खोल्न मिल्ने गरी सुरक्षित गर्नुहोस्।
        </p>

        <button
          onClick={handleExportCSV}
          className="w-full sm:w-auto px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>CSV ब्याकअप फाइल डाउनलोड गर्नुहोस्</span>
        </button>
      </div>

      {/* Cloud Account Sync (Ready for Supabase / Laravel) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              अनलाइन क्लाउड सिङ्क (Supabase / Laravel API)
            </h3>
            <p className="text-xs text-slate-500">बहु-उपकरण (Multi-device) सिङ्क तयारी</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          यो एप Supabase वा Laravel API + PostgreSQL ब्याकइन्डसँग सिधै जोड्न मिल्ने गरी आर्किटेक्चर गरिएको छ।
          अहिले यो स्थानीय डेमो मोडमा चलिरहेको छ।
        </p>

        <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              डेमो खाता पहिचान (Demo Account ID)
            </label>
            <input
              type="text"
              readOnly
              value="USR-2083-NEPAL"
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              सुरक्षा टोकन (Auth Token)
            </label>
            <input
              type="password"
              readOnly
              value="********"
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
            />
          </div>

          <button
            onClick={() =>
              alert(
                'सूचना: अनलाइन प्रमाणीकरण ब्याकइन्ड एपीआई (Supabase / Laravel PostgreSQL) जडान भएपछि सक्रिय हुनेछ। अहिले तपाईंको सबै विवरण स्थानीय भण्डारणमा सुरक्षित छ।'
              )
            }
            className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors mt-2"
          >
            लगइन / खाता खोल्नुहोस् (डेमो)
          </button>
        </div>
      </div>

      {/* Developer Information Settings (Requirement 1 & 2: Editable in App Settings) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              विकासकर्ता सेटिङ सम्पादन (Developer Settings)
            </h3>
            <p className="text-xs text-slate-500">
              विकासकर्ताको नाम र बिक्रम संवत् (BS) निर्माण मिति प्रविष्ट र सम्पादन गर्नुहोस्
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveDeveloperSettings} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              विकासकर्ताको नाम (Developer Name)
            </label>
            <input
              type="text"
              value={devNameInput}
              onChange={(e) => setDevNameInput(e.target.value)}
              placeholder="उदा. SUSIL KADEL"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                निर्माण मिति - बिक्रम संवत् (Development Date - BS)
              </label>
              <button
                type="button"
                onClick={() => setDevDateInput(getAppProjectInitBSDate())}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-2"
                title="प्रोजेक्ट पहिलो पटक सुरु भएको आधिकारिक BS मिति राख्नुहोस्"
              >
                सुरुवाती स्थापना मिति
              </button>
            </div>
            <input
              type="text"
              value={devDateInput}
              onChange={(e) => setDevDateInput(e.target.value)}
              placeholder="उदा. २०८३ कार्तिक ०७"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all font-medium"
            />
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span>नेपाली बिक्रम संवत् (BS) ढाँचा</span>
              <button
                type="button"
                onClick={() => setDevDateInput(formatBSDateNepali(getTodayBS()))}
                className="text-emerald-700 hover:text-emerald-800 font-medium"
              >
                आजको BS मिति राख्नुहोस्
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-2.5 px-3 bg-[#168447] hover:bg-[#126b39] active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>परिवर्तन सुरक्षित गर्नुहोस् (Save Settings)</span>
            </button>
            <button
              type="button"
              onClick={handleResetDeveloperSettings}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              title="पूर्वनिर्धारित मानमा फर्काउनुहोस्"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>पूर्वनिर्धारित</span>
            </button>
          </div>
        </form>
      </div>

      {/* Developed By Section (Exact Heading: "Developed By", Displaying ONLY Developer Name and Development Date) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Developed By
            </h3>
            <p className="text-xs text-slate-500">
              मेरो हिसाब आधिकारिक विकासकर्ता तथा निर्माण विवरण
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/90 via-white to-slate-50/70 p-4 rounded-xl border border-emerald-200/80">
          <div className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-emerald-100/70">
              <span className="font-bold text-slate-700">Developed By:</span>
              <span className="font-extrabold text-[#168447] text-base tracking-wide">
                {devSettings.developerName}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-0.5">
              <span className="font-bold text-slate-700">Development Date:</span>
              <span className="font-bold text-slate-900 text-sm">
                {devSettings.developmentDateBS}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* About App Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">एपको बारेमा (About App)</h3>
              <p className="text-xs text-slate-500">Mero Hisab Specification</p>
            </div>
          </div>
          {onReplaySplash && (
            <button
              onClick={onReplaySplash}
              className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>स्प्लास हेर्नुहोस्</span>
            </button>
          )}
        </div>

        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong>मेरो हिसाब (Mero Hisab)</strong> नेपालका लागि विशेष रूपमा तयार पारिएको व्यक्तिगत आम्दानी तथा खर्च व्यवस्थापन प्रणाली हो। यसमा आधिकारिक बिक्रम संवत् क्यालेन्डर इन्जिन, दैनिक र मासिक प्रतिवेदन, अफलाइन स्थानीय भण्डारण र CSV ब्याकअप समावेश छ।
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-slate-700">
            <div>• <strong>एपको नाम:</strong> मेरो हिसाब (Mero Hisab)</div>
            <div>• <strong>संस्करण:</strong> v1.0.0 (Android-First Mobile App)</div>
            <div>• <strong>Developed By:</strong> <span className="font-bold text-emerald-800">{devSettings.developerName}</span></div>
            <div>• <strong>Development Date:</strong> <span className="font-semibold text-slate-800">{devSettings.developmentDateBS} (BS)</span></div>
            <div>• <strong>क्यालेन्डर प्रणाली:</strong> बिक्रम संवत् (वि.सं. २०८० - २०९०)</div>
            <div>• <strong>गोपनीयता:</strong> १००% अफलाइन, प्रयोगकर्ताको डिभाइसमै सुरक्षित</div>
          </div>
        </div>
      </div>

      {/* Data Management & Reset */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
          डाटा व्यवस्थापन (Data Reset & Restore)
        </h3>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>सुरुवाती नमुना डाटा पुन: लोड गर्नुहोस्</span>
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>सबै कारोबार खाली गर्नुहोस्</span>
          </button>
        </div>
      </div>

      {/* App Version & Developer Footer Info */}
      <div className="text-center py-4 text-xs text-slate-500 space-y-1 border-t border-slate-200/60 mt-4">
        <div className="font-bold text-slate-800">मेरो हिसाब (Mero Hisab) v1.0.0</div>
        <div className="font-semibold text-emerald-800">
          Developed By: {devSettings.developerName}
        </div>
        <div className="text-slate-500 text-[11px]">
          Development Date: {devSettings.developmentDateBS}
        </div>
        <div className="text-slate-400 text-[10px]">नेपाली व्यक्तिगत आम्दानी तथा खर्च व्यवस्थापन प्रणाली</div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h4 className="text-base font-bold text-slate-900 mb-2">नमुना डाटा पुनर्स्थापना</h4>
            <p className="text-xs text-slate-600 mb-4">
              के तपाईं हालको कारोबार हटाएर सुरुवाती नेपाली नमुना कारोबारहरू पुन: लोड गर्न चाहनुहुन्छ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                रद्द गर्नुहोस्
              </button>
              <button
                onClick={() => {
                  resetToDemoData();
                  setShowResetConfirm(false);
                  setFeedbackMsg('सुरुवाती नमुना डाटा पुनर्स्थापना गरियो!');
                  setTimeout(() => setFeedbackMsg(''), 3000);
                }}
                className="px-3 py-1.5 text-xs bg-emerald-700 text-white font-bold rounded-lg"
              >
                हो, लोड गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h4 className="text-base font-bold text-red-600 mb-2">सबै कारोबार मेटाउने?</h4>
            <p className="text-xs text-slate-600 mb-4">
              के तपाईं सबै कारोबार रेकर्ड हटाउन निश्चित हुनुहुन्छ? यो उल्टाउन सकिँदैन।
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                रद्द गर्नुहोस्
              </button>
              <button
                onClick={() => {
                  clearAll();
                  setShowClearConfirm(false);
                  setFeedbackMsg('सबै कारोबार सफलतापूर्वक खाली गरियो!');
                  setTimeout(() => setFeedbackMsg(''), 3000);
                }}
                className="px-3 py-1.5 text-xs bg-red-600 text-white font-bold rounded-lg"
              >
                हो, मेटाउनुहोस्
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
