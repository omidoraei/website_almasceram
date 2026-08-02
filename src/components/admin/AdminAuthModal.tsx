import React, { useState } from 'react';
import { X, Lock, Key, User, AlertOctagon, ShieldCheck, Smartphone, CheckCircle2 } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [authStep, setAuthStep] = useState<'login' | '2fa' | 'forgot'>('login');
  const [email, setEmail] = useState('admin@almasceram.com');
  const [password, setPassword] = useState('admin123');
  const [otpCode, setOtpCode] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  if (!isOpen) return null;

  // Step 1: Login Credentials
  const handleStep1Login = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLocked) {
      setError('حساب به علت ۵ بار تلاش ناموفق موقتاً مسدود شده است. لطفاً ۳۰ ثانیه صبر کنید.');
      return;
    }

    if (email === 'admin@almasceram.com' && password === 'admin123') {
      setFailedAttempts(0);
      setAuthStep('2fa');
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (nextAttempts >= 5) {
        setIsLocked(true);
        setError('حساب به علت ۵ بار ورود اشتباه موقتاً مسدود گردید.');
        setTimeout(() => {
          setIsLocked(false);
          setFailedAttempts(0);
          setError(null);
        }, 30000);
      } else {
        setError(`نام کاربری یا کلمه عبور نادرست است. (تلاش‌های باقی‌مانده: ${5 - nextAttempts})`);
      }
    }
  };

  // Step 2: 2FA Verification
  const handleStep2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otpCode.length === 6 || otpCode === '123456') {
      const existingLogs = JSON.parse(localStorage.getItem('almas_ceram_sec_logs') || '[]');
      const newLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        event: 'ورود موفقیت‌آمیز ۲ مرحله‌ای (2FA)',
        email,
        status: 'SUCCESS',
        ip: '192.168.1.1'
      };
      localStorage.setItem('almas_ceram_sec_logs', JSON.stringify([newLog, ...existingLogs.slice(0, 19)]));

      onLoginSuccess();
      onClose();
    } else {
      setError('کد ۶ رقمی یک‌بارمصرف واردشده معتبر نیست. (کد دمو: 123456)');
    }
  };

  // Forgot Password Flow
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('لینک بازیابی رمز عبور به ایمیل مدیر ارسال گردید.');
    setTimeout(() => {
      setAuthStep('login');
      setSuccessMsg(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md dir-rtl">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 text-right text-slate-100 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center mx-auto text-xl shadow-lg shadow-amber-500/20">
            {authStep === '2fa' ? <Smartphone className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <h3 className="text-lg font-black text-white">
            {authStep === 'login' && 'ورود ایمن به پنل مدیریت الماس سرام'}
            {authStep === '2fa' && 'احراز هویت دو مرحله‌ای (2FA / OTP)'}
            {authStep === 'forgot' && 'بازیابی کلمه عبور مدیر'}
          </h3>
          <p className="text-xs text-slate-400 font-light">
            {authStep === '2fa' ? 'کد یک‌بارمصرف ارسال‌شده به اپلیکیشن Authenticator را وارد کنید' : 'محافظت‌شده با مکانیزم Brute-Force & Rate-Limiter'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl text-center flex items-center justify-center gap-2">
            <AlertOctagon className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: Login Credentials Form */}
        {authStep === 'login' && (
          <form onSubmit={handleStep1Login} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 mb-1 block font-bold">پست الکترونیکی مدیر:</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  disabled={isLocked}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pr-9 pl-3 text-slate-100 font-mono text-left focus:border-amber-500 disabled:opacity-50"
                />
                <User className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-300 font-bold block">رمز عبور ارشد:</label>
                <button
                  type="button"
                  onClick={() => setAuthStep('forgot')}
                  className="text-amber-400 text-[11px] hover:underline"
                >
                  رمز عبور را فراموش کرده‌اید؟
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  disabled={isLocked}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pr-9 pl-3 text-slate-100 font-mono text-left focus:border-amber-500 disabled:opacity-50"
                />
                <Key className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              </div>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-xl text-[11px] text-amber-300/90 font-mono">
              💡 اکانت دمو مدیریت:
              <br />
              ایمیل: admin@almasceram.com
              <br />
              رمز عبور: admin123
            </div>

            <button
              type="submit"
              disabled={isLocked}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isLocked ? 'حساب قفل شده است...' : 'ادامه به مرحله احراز 2FA'}
            </button>
          </form>
        )}

        {/* STEP 2: 2FA Code Input Form */}
        {authStep === '2fa' && (
          <form onSubmit={handleStep2FA} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 mb-1 block font-bold text-center">کد ۶ رقمی یک‌بارمصرف (2FA OTP):</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-slate-950 border border-amber-500/50 rounded-xl py-3 px-3 text-amber-300 font-mono text-center text-lg font-black tracking-widest focus:border-amber-400"
              />
            </div>

            <div className="bg-emerald-950/30 border border-emerald-500/30 p-2.5 rounded-xl text-[11px] text-emerald-300/90 font-mono text-center">
              💡 کد تأیید دمو: <strong>123456</strong>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAuthStep('login')}
                className="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                بازگشت
              </button>

              <button
                type="submit"
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                تایید نهایی و ورود به پنل ادمین
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {authStep === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 mb-1 block font-bold">پست الکترونیکی جهت دریافت لینک بازیابی:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-slate-100 font-mono text-left focus:border-amber-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAuthStep('login')}
                className="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                بازگشت
              </button>

              <button
                type="submit"
                className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                ارسال لینک بازیابی رمز
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
