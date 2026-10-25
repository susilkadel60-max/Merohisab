import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleResetData = () => {
    try {
      localStorage.removeItem('mero_hisab_transactions_v2');
      localStorage.removeItem('mero_hisab_transactions');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
    window.location.reload();
  };

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-['Mukta',sans-serif]">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
            {/* Top Green Accent Header */}
            <div className="bg-[#168447] text-white p-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-3">
                <AlertTriangle className="w-8 h-8 text-amber-300" />
              </div>
              <h2 className="text-xl font-bold">मेरो हिसाब (Mero Hisab)</h2>
              <p className="text-xs text-emerald-100 mt-1">
                एप्लिकेशन पुन: प्राप्ति (Application Recovery)
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
                <strong>नोट:</strong> केही अस्थायी डाटा वा ब्राउजर मेमोरीका कारण एप्लिकेशन लोड हुन सकेन। कृपया तलको बटन थिचेर एप पुन: लोड गर्नुहोस् वा नयाँ डाटाबाट सुरु गर्नुहोस्।
              </div>

              {this.state.error && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-700 max-h-28 overflow-y-auto break-all">
                  {this.state.error.message || String(this.state.error)}
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  onClick={this.handleReload}
                  className="w-full py-3 px-4 bg-[#168447] hover:bg-[#116e3a] active:scale-98 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>पुन: प्रयास गर्नुहोस् (Try Again)</span>
                </button>

                <button
                  onClick={this.handleResetData}
                  className="w-full py-3 px-4 bg-[#C62828] hover:bg-[#a72020] active:scale-98 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>डाटा रिसेट गरी ताजा सुरु गर्नुहोस् (Reset Storage)</span>
                </button>
              </div>

              <div className="pt-4 text-center border-t border-slate-100 text-[11px] text-slate-500">
                Developed by <strong className="text-emerald-700">SUSIL KADEL</strong>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
